import { Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import { addMetaTags, ROUTES, type State } from './utils'
import { xmtpSupport } from './middlewares'
import { handlerFrameStoryline, handlerSignBootstrapGameSession } from './features'

export const app = new Frog<{ State: State }>({
  ...addMetaTags('xmtp'),
  initialState: {},
}).use(xmtpSupport())

/**
 * Pick a storyline
 */
app.frame(ROUTES.pickStoryline, handlerFrameStoryline)

/**
 * Signature transitional frame
 * Gets the user's signature for confirming bootstrapping a new game using a specific storyline
 */
app.signature(ROUTES.signBootstrap, handlerSignBootstrapGameSession)

app.use('/*', serveStatic({ root: './public' }))
devtools(app, { serveStatic })

if (typeof Bun !== 'undefined') {
  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  })
  console.log('Server is running on port 3000')
}
