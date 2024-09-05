import { Elysia, t } from 'elysia'
import {
  initializeMicroRollup,
  schemas,
  machine as playbookMachine,
  MACHINE_PLAYBOOK_ID,
  MruActions,
} from './stackr'
import { ActionConfirmationStatus } from '@stackr/sdk'

export enum SERVER_ROUTES_GROUPS_PREFIX {
  mru = '/mru',
}

export enum ROUTES_MRU {
  info = '/info',
  bootstrapGame = '/bootstrap',
  cast = '/cast',
  configureInfra = '/configure-infra',
}

/**
 * Runs the backend (Elysia + MRU)
 */
export async function main() {
  const mru = await initializeMicroRollup()

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
    /**
     * Bootstrap new session for a given storyline
     */
    .post(
      ROUTES_MRU.bootstrapGame,
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
    /**
     * Cast character
     */
    .post(
      ROUTES_MRU.cast,
      async ({ body }) => {
        try {
          const inputs = {
            gameId: body.gameId,
            storylineId: body.storylineId,
            characterId: body.characterId,
            personality: body.personality,
            alignment: body.alignment,
            nftName: body.nftName,
            chainId: body.chainId,
            nftContractAddress: body.nftContractAddress,
            nftId: body.nftId,
            timestamp: +body.timestamp,
          }
          const castCharacter = schemas.castCharacter.actionFrom({
            inputs,
            signature: body.signature,
            msgSender: body.player,
          })

          const ack = await mru.submitAction(MruActions.cast, castCharacter)

          // leverage the ack to wait for C1 and access logs & error from STF execution
          const { logs, errors } = await ack.waitFor(ActionConfirmationStatus.C1)

          const machine = mru.stateMachines.get<typeof playbookMachine>(MACHINE_PLAYBOOK_ID)
          if (!machine) {
            throw new Error('Machine not found')
          }
          const { state } = machine
          const completeCast = Object.keys(state.storylines[body.storylineId].characters)
          const sessionCast = Object.keys(
            state.players[body.player].games[body.storylineId].sessions[body.gameId].characters,
          )
          const leftToCast = completeCast.filter((character) => !sessionCast.includes(character))
          const nextCharacterToCast = leftToCast.length > 0 ? leftToCast[0] : null

          // Return the casted character, along with the id next character to cast
          return {
            idNextCharacterToCast: nextCharacterToCast,
            casted:
              state.players[body.player].games[body.storylineId].sessions[body.gameId].characters[
                body.characterId
              ],
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
          gameId: t.String(),
          characterId: t.String(),
          personality: t.String(),
          alignment: t.String(),
          nftName: t.String(),
          nftContractAddress: t.String(),
          nftId: t.String(),
          chainId: t.String(),
          signature: t.String(),
          timestamp: t.Number(),
        }),
      },
    )
    /**
     * Link deployed LLM narrator contract address
     */
    .post(
      ROUTES_MRU.configureInfra,
      async ({ body }) => {
        try {
          const inputs = {
            aiContractAddress: body.aiContractAddress,
            storylineId: body.storylineId,
            gameId: body.gameId,
            timestamp: +body.timestamp,
          }

          const configureGameInfra = schemas.configureGameInfra.actionFrom({
            inputs,
            signature: body.signature,
            msgSender: body.player,
          })

          const ack = await mru.submitAction(MruActions.configureInfra, configureGameInfra)

          // leverage the ack to wait for C1 and access logs & error from STF execution
          const { logs, errors } = await ack.waitFor(ActionConfirmationStatus.C1)

          const machine = mru.stateMachines.get<typeof playbookMachine>(MACHINE_PLAYBOOK_ID)
          if (!machine) {
            throw new Error('Machine not found')
          }
          const { state } = machine

          return {
            status: state.players[body.player].games[body.storylineId].sessions[body.gameId].status,
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
          gameId: t.String(),
          aiContractAddress: t.String(),
          signature: t.String(),
          timestamp: t.Number(),
        }),
      },
    )
  new Elysia()
    .use(mruRoutes)
    .get('/', () => 'Hello Elysia')
    .listen(3000)
}
