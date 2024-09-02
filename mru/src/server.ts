import { Elysia, t } from 'elysia'
import {
  initializeMicroRollup,
  schemas,
  machine as playbookMachine,
  MACHINE_PLAYBOOK_ID,
  MruActions,
} from './stackr'
import { ActionConfirmationStatus } from '@stackr/sdk'
import { fetchStoryline } from './helpers/fetch-storyline'

export enum SERVER_ROUTES_GROUPS_PREFIX {
  restApi = '/api',
  mru = '/mru',
}

export enum ROUTES_REST_API {
  getAllStorylines = '/storylines',
  getStoryline = '/storyline/:id',
}

export enum ROUTES_MRU {
  info = '/info',
  bootstrapGame = '/bootstrap',
  cast = '/castRole',
}

/**
 * Runs the backend (Elysia + MRU)
 */
export async function main() {
  const mru = await initializeMicroRollup()

  /**
   * API routes
   */
  const restApiRoutes = new Elysia({ prefix: SERVER_ROUTES_GROUPS_PREFIX.restApi }).get(
    ROUTES_REST_API.getStoryline,
    async ({ params: { id } }) => {
      const machine = mru.stateMachines.get<typeof playbookMachine>(MACHINE_PLAYBOOK_ID)
      if (!machine) {
        throw new Error('Machine not found')
      }
      const { state } = machine
      const storyline = await fetchStoryline({ state, storylineId: id })
      return {
        storyline: {
          id,
          title: storyline.title,
          description: storyline.description,
          roles: Object.keys(storyline.characters).map((characterId) => ({
            archetype: storyline.characters[characterId].name,
            description: storyline.characters[characterId].description,
            role: storyline.characters[characterId].initial_role,
          })),
        },
      }
    },
  )
  /**
   * MRU routes
   */
  const mruRoutes = new Elysia({ prefix: SERVER_ROUTES_GROUPS_PREFIX.mru })
    /**
     * Provide easy access to MRU info for signatures
     */
    .get(
      ROUTES_MRU.info,
      async () => {
        const transitionToSchema = mru.getStfSchemaMap()
        const { name, version, chainId, verifyingContract, salt } = mru.config.domain
        return {
          domain: {
            name,
            version,
            chainId,
            verifyingContract,
            salt,
          },
          transitionToSchema,
          schemas: Object.values(schemas).reduce(
            (acc, schema) => {
              acc[schema.identifier] = {
                primaryType: schema.EIP712TypedData.primaryType,
                types: schema.EIP712TypedData.types,
              }
              return acc
            },
            {} as Record<string, any>,
          ),
        }
      },
      {
        type: 'json',
      },
    )
    .post(
      ROUTES_MRU.bootstrapGame,
      /**
       * Bootstrap new session for a given storyline
       */
      async ({ body }) => {
        try {
          const inputs = {
            storylineId: body.storylineId,
            timestamp: +body.timestamp,
          }
          const bootstrapGameAction = schemas.bootstrapGame.actionFrom({
            inputs,
            signature: body.signature,
            msgSender: body.player,
          })

          const ack = await mru.submitAction(MruActions.bootstrap, bootstrapGameAction)

          // leverage the ack to wait for C1 and access logs & error from STF execution
          const { logs, errors } = await ack.waitFor(ActionConfirmationStatus.C1)

          const machine = mru.stateMachines.get<typeof playbookMachine>(MACHINE_PLAYBOOK_ID)
          if (!machine) {
            throw new Error('Machine not found')
          }
          const { state } = machine
          const lastCreatedSession = Object.keys(
            state.players[body.player].games[body.storylineId].sessions,
          ).pop()
          // Return the created game id
          return {
            gameId: lastCreatedSession,
          }
        } catch (err) {
          console.error(err)
        }
      },
      {
        type: 'json',
        body: t.Object({
          player: t.String(),
          storylineId: t.String(),
          signature: t.String(),
          timestamp: t.Number(),
        }),
      },
    )
  new Elysia()
    .use(restApiRoutes)
    .use(mruRoutes)
    .get('/', () => 'Hello Elysia')
    .listen(3000)
}
