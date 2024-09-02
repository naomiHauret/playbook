import { MicroRollup } from '@stackr/sdk'
import { stackrConfig } from '../../stackr.config'
import { machine } from './machine'
import { schemas } from './actions'

async function initializeMicroRollup() {
  const mru = await MicroRollup({
    config: stackrConfig,
    actionSchemas: [...Object.values(schemas)],
    stateMachines: [machine],
  })

  await mru.init()

  return mru
}

export { initializeMicroRollup }
