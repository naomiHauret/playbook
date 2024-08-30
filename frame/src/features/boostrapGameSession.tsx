import { type SignatureContext } from 'frog/_lib/types/context'
import { COMMON_SIGNATURE, ROUTES, STATE_PROPERTIES, type State } from '../utils'
import { type BlankInput } from 'frog/_lib/types/routes'
import { schemas } from '../../../mru/src/stackr/actions'

export async function handlerSignBootstrapGameSession(
  c: SignatureContext<
    {
      State: State
    } & {
      Variables: {
        client?: 'xmtp' | 'farcaster'
        verifiedWalletAddress?: string
      }
    },
    ROUTES.signBootstrap,
    BlankInput
  >,
) {
  const { req, previousState } = c
  const storylineId = req.query(STATE_PROPERTIES.storylineId)
  const timestamp = Date.now()
  const inputs = {
    storylineId,
    timestamp,
  }

  //@ts-expect-error
  const signature = c.signTypedData({
    ...COMMON_SIGNATURE,
    types: schemas.bootstrapGame.EIP712TypedData.types,
    primaryType: schemas.bootstrapGame.EIP712TypedData.primaryType,
    message: inputs,
  })

  previousState.storylineId = storylineId
  previousState.timestamp = timestamp

  return signature
}
