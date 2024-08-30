import { Elysia, t } from 'elysia'
import { mru } from './stackr/mru.ts'
import { machine as playbookMachine, MACHINE_PLAYBOOK_ID } from './stackr/machine.ts'
import { schemas } from './stackr/actions.ts'
import { ActionConfirmationStatus } from '@stackr/sdk'

new Elysia()
  .get('/', () => 'Hello Elysia')
  .get('/api/storylines', async () => {
    /**
     * Get list of storylines
     */
    const machine = mru.stateMachines.get<typeof playbookMachine>(MACHINE_PLAYBOOK_ID)
    if (!machine) {
      throw new Error('Machine not found')
    }
    const { state } = machine

    return {
      storylines: Object.keys(state.storylines).map((storylineId) => ({
        id: storylineId,
        title: state.storylines[storylineId].title,
        description: state.storylines[storylineId].description,
        minimumNfts: Object.keys(state.storylines[storylineId].characters).length,
      })),
    }
  })
  .get('/api/storyline/:id', async ({ params: { id } }) => {
    /**
     * Get single storyline
     */
    const machine = mru.stateMachines.get<typeof playbookMachine>(MACHINE_PLAYBOOK_ID)
    if (!machine) {
      throw new Error('Machine not found')
    }
    const { state } = machine
    const storyline = state.storylines[id]
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
  })

  .post(
    '/mru/bootstrap',
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

        const ack = await mru.submitAction('bootstrapGame', bootstrapGameAction)

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
        timestamp: t.Number({
          maximum: Date.now(), // very basic validation for the timestamp, could be way better but let's not focus on that right now
        }),
      }),
    },
  )

  .listen(3000)
