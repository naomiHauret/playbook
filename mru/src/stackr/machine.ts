import { StateMachine } from '@stackr/sdk/machine'
import * as genesis from '../../genesis-state.json'
import { type AppState, PlaybookState } from './state'
import { transitions } from './transitions'

const MACHINE_PLAYBOOK_ID = 'playbook'
const machine = new StateMachine({
  id: MACHINE_PLAYBOOK_ID,
  stateClass: PlaybookState,
  initialState: genesis as AppState,
  on: transitions,
})

export { machine, MACHINE_PLAYBOOK_ID }
