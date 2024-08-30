import { validateFramesPost } from '@xmtp/frames-validator'
import type { MiddlewareHandler } from 'hono'

/**
 * Middleware that verifies if the request is a POST and relevant for XMTP processing
 */
export function xmtpSupport(): MiddlewareHandler<{
  Variables: { client?: 'xmtp' | 'farcaster'; verifiedWalletAddress?: string }
}> {
  return async (c, next) => {
    if (c.req.method === 'POST') {
      const requestBody = (await c.req.json().catch(() => {})) || {}
      if (requestBody?.clientProtocol?.includes('xmtp', 'v1')) {
        c.set('client', 'xmtp')
        const { verifiedWalletAddress } = await validateFramesPost(requestBody)
        c.set('verifiedWalletAddress', verifiedWalletAddress)
      }
    }
    await next()
  }
}
