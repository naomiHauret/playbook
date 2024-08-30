import { Button, type FrameContext } from 'frog'
import { API_ENDPOINT, ROUTES, STATE_PROPERTIES, type State } from '../utils'
import { type BlankInput } from 'frog/_lib/types/routes'

export async function handlerFrameStoryline(
  c: FrameContext<
    {
      State: State
    } & {
      Variables: {
        client?: 'xmtp' | 'farcaster'
        verifiedWalletAddress?: string
      }
    },
    ROUTES.pickStoryline,
    BlankInput
  >,
) {
  if (c.transactionId) {
    const raw = await fetch(`${API_ENDPOINT}/mru/bootstrap`, {
      method: 'POST',
      body: JSON.stringify({
        storylineId: c.previousState.storylineId,
        timestamp: c.previousState.timestamp,
        signature: c.transactionId,
        player: c?.var?.verifiedWalletAddress,
      }),
    })
    const result = await raw.json()

    return c.res({
      action: ROUTES.casting,
      image: (
        <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
          The Enchanted Forest - save created
        </div>
      ),
      intents: [<Button value={result.gameId}>Begin casting</Button>],
    })
  }
  return c.res({
    action: '/bootstrap',
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>The Enchanted Forest</div>
    ),
    intents: [
      // We have to use a url parameter as `value` can't be used as a prop in `Button.Signature`
      <Button.Signature target={`${ROUTES.signBootstrap}?${STATE_PROPERTIES.storylineId}=1`}>
        Choose this story
      </Button.Signature>,
    ],
  })
}
