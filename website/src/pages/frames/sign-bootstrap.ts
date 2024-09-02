import { getXmtpFrameMessage,isXmtpFrameRequest } from "@coinbase/onchainkit/xmtp";
import type { APIRoute } from 'astro';
import { getFrameState } from "~/utils/frame-state";
/**
 * Signature to bootstrap a new game session for a given storyline
 * Triggered by a frame used in a XMTP client (eg: Converse, Coinbase Wallet)
 */
export const POST: APIRoute = async ({params, request}) => {
  const body = await request.json()
  if (isXmtpFrameRequest(body)) {
    const { isValid, message } = await getXmtpFrameMessage(body); 
    if (isValid && message?.verifiedWalletAddress) {

      const raw = await fetch(`${import.meta.env.MRU_ENDPOINT}/mru/info`)
      const signatureInfo = await raw.json()
      const { storylineId, timestamp } = getFrameState(message?.state)
      if(!storylineId) {
        return new Response(null, {
          status: 400,
          statusText: "Invalid request"
        })
      }
      const inputs = {
        storylineId,
        timestamp: +timestamp
      }

      return new Response(
        JSON.stringify({
        chainId: `eip155:${signatureInfo.domain.chainId}`,
        method: "eth_signTypedData_v4",
        params: {
          domain: signatureInfo.domain,
          types: signatureInfo.schemas.bootstrapGame.types,
          primaryType: signatureInfo.schemas.bootstrapGame.primaryType,
          message: inputs
      }
     }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
    }
  }

  return new Response(null, {
    status: 401,
    statusText: "Not allowed"
  })
}
