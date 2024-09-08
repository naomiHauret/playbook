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
  mru = '/mru',
  api = '/api',
}

export enum ROUTES_API {
  storylines = '/storylines',
  storyline = '/storylines/:storylineId',
  playerSession = '/players/:player/games/:storylineId/sessions/:gameId',
}
export enum ROUTES_MRU {
  info = '/info',
  bootstrapGame = '/bootstrap',
  cast = '/cast',
  configureInfra = '/configure-infra',
  drawEvent = '/events/draw',
  play = '/play',
}

/**
 * Runs the backend (Elysia + MRU)
 */
export async function main() {
  const mru = await initializeMicroRollup()

  /**
   * API routes
   */
  const apiRoutes = new Elysia({ prefix: SERVER_ROUTES_GROUPS_PREFIX.api })
    /**
     * Return storyline
     */
    .get(
      ROUTES_API.storylines,

      async () => {
        const machine = mru.stateMachines.get<typeof playbookMachine>(MACHINE_PLAYBOOK_ID)
        if (!machine) {
          throw new Error('Machine not found')
        }
        const { state } = machine

        const requests = await Promise.allSettled(
          Object.keys(state.storylines).map(async (id) => {
            const story = await fetchStoryline({
              storylineId: id,
              state,
            })
            return {
              id,
              ...story,
            }
          }),
        )

        const storylines = requests
          .filter((request) => request.status === 'fulfilled')
          .map((request) => {
            const story = request.value
            return {
              id: story.id,
              title: story.title,
              description: story.description,
              casting: Object.keys(story.characters).length,
            }
          })

        return storylines
      },
      {
        type: 'json',
      },
    )
    /**
     * Return storyline
     */
    .get(
      ROUTES_API.storyline,

      async ({ params: { storylineId } }) => {
        const machine = mru.stateMachines.get<typeof playbookMachine>(MACHINE_PLAYBOOK_ID)
        if (!machine) {
          throw new Error('Machine not found')
        }
        const { state } = machine
        const storyline = await fetchStoryline({
          storylineId,
          state,
        })
        return storyline
      },
      {
        params: t.Object({
          storylineId: t.String(),
        }),
        type: 'json',
      },
    )
    /**
     * Return game session for a given player and storyline
     */
    .get(
      ROUTES_API.playerSession,

      async ({ params: { player, storylineId, gameId } }) => {
        const machine = mru.stateMachines.get<typeof playbookMachine>(MACHINE_PLAYBOOK_ID)
        if (!machine) {
          throw new Error('Machine not found')
        }
        const { state } = machine
        const storyline = await fetchStoryline({
          storylineId,
          state,
        })
        return {
          storyline,
          session: state.players[player].games[storylineId].sessions[gameId],
        }
      },
      {
        params: t.Object({
          player: t.String(),
          storylineId: t.String(),
          gameId: t.String(),
        }),
        type: 'json',
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
    /**
     * Request to draw an event card
     */
    .post(
      ROUTES_MRU.drawEvent,
      async ({ body }) => {
        try {
          const inputs = {
            storylineId: body.storylineId,
            gameId: body.gameId,
            timestamp: +body.timestamp,
          }

          const drawEvent = schemas.drawEvent.actionFrom({
            inputs,
            signature: body.signature,
            msgSender: body.player,
          })

          const ack = await mru.submitAction(MruActions.drawEvent, drawEvent)

          // leverage the ack to wait for C1 and access logs & error from STF execution
          const { logs, errors } = await ack.waitFor(ActionConfirmationStatus.C1)

          const machine = mru.stateMachines.get<typeof playbookMachine>(MACHINE_PLAYBOOK_ID)
          if (!machine) {
            throw new Error('Machine not found')
          }
          const { state } = machine
          const narration = await fetchStoryline({
            storylineId: body.storylineId,
            state,
          })
          const session = state.players[body.player].games[body.storylineId].sessions[body.gameId]
          const cardId = session.current_event.id
          const card =
            session.events_discard_pile.length <= 1
              ? narration.initial_situations_pile[cardId]
              : narration.events_deck[cardId]

          return {
            event: card,
            narrator: session.galadriel_contract_address,
            game: session.current_event,
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
          signature: t.String(),
          timestamp: t.Number(),
        }),
      },
    )
    /**
     * Request to play a turn
     */
    .post(
      ROUTES_MRU.play,
      async ({ body }) => {
        try {
          const inputs = {
            storylineId: body.storylineId,
            gameId: body.gameId,
            castedCharacterId: body.castedCharacterId,
            cardId: body.cardId,
            planningAction: body.planningAction,
            deckType: body.deckType,
            actionType: body.actionType,
            timestamp: +body.timestamp,
          }

          const playTurn = schemas.playTurn.actionFrom({
            inputs,
            signature: body.signature,
            msgSender: body.player,
          })

          const ack = await mru.submitAction(MruActions.playTurn, playTurn)

          // leverage the ack to wait for C1 and access logs & error from STF execution
          const { logs, errors } = await ack.waitFor(ActionConfirmationStatus.C1)

          const machine = mru.stateMachines.get<typeof playbookMachine>(MACHINE_PLAYBOOK_ID)
          if (!machine) {
            throw new Error('Machine not found')
          }
          const { state } = machine
          const narration = await fetchStoryline({
            storylineId: body.storylineId,
            state,
          })
          const session = state.players[body.player].games[body.storylineId].sessions[body.gameId]
          const cardId = session.current_event.id
          const card =
            session.events_discard_pile.length <= 1
              ? narration.initial_situations_pile[cardId]
              : narration.events_deck[cardId]

          return {
            event: card,
            narrator: session.galadriel_contract_address,
            game: session.current_event,
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
          castedCharacterId: t.String(),
          cardId: t.String(),
          planningAction: t.String(),
          deckType: t.String(),
          actionType: t.String(),
          gameId: t.String(),
          signature: t.String(),
          timestamp: t.Number(),
        }),
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
    .use(apiRoutes)
    .get('/', () => 'Hello Elysia')
    .listen(3000)
}
