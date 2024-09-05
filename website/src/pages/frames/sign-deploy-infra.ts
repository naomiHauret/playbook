import { getXmtpFrameMessage, isXmtpFrameRequest } from '@coinbase/onchainkit/xmtp'
import type { APIRoute } from 'astro'
import { getFrameState } from '~/utils/frame-state'
import { getMRUSignatureInfo } from '~/utils/get-mru-signature-info'
/**
 * Signature to register the deployed infrastructure
 * Triggered by a frame used in a XMTP client (eg: Converse, Coinbase Wallet)
 */
export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json()
  if (isXmtpFrameRequest(body)) {
    const { isValid, message } = await getXmtpFrameMessage(body)
    if (isValid && message?.verifiedWalletAddress) {
      const signatureInfo = await getMRUSignatureInfo()

      const { storylineId, gameId, timestamp, contract } = getFrameState(message?.state)
      if (!storylineId || !gameId || !timestamp || !contract) {
        return new Response(null, {
          status: 400,
          statusText: 'Invalid request',
        })
      }
      const inputs = {
        aiContractAddress: contract,
        storylineId,
        gameId,
        timestamp: +timestamp,
      }

      return new Response(
        JSON.stringify({
          chainId: `eip155:${signatureInfo.domain.chainId}`,
          method: 'eth_signTypedData_v4',
          params: {
            domain: signatureInfo.domain,
            types: signatureInfo.schemas.configureGameInfra.types,
            primaryType: signatureInfo.schemas.configureGameInfra.primaryType,
            message: inputs,
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }
  }

  return new Response(null, {
    status: 401,
    statusText: 'Not allowed',
  })
}
