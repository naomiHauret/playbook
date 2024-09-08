import type { APIRoute } from 'astro'
import { deployNarratorContract } from '~/services/narrator'
import { xmtpClient } from '~/services/xmtp'

/**
 * Deploys the narrator LLM contract
 */
export const POST: APIRoute = async ({ params, request, url }) => {
  const body = await request.json()
  const { player, storylineId, gameId } = body
  const conversation = await xmtpClient.conversations.newConversation(player!!)
  const receipt = await deployNarratorContract({
    player,
    storylineId,
    gameId,
  })
  if (receipt.contractAddress) {
    await conversation.send(
      `Your narrator is ready! Link it to your game to complete your setup.\n\n${url.origin}/storylines/${storylineId}/game/${gameId}/narrator?status=deployed&contract=${receipt.contractAddress}`,
    )

    return new Response(JSON.stringify(receipt), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new Response(null, {
    status: 401,
    statusText: 'Not allowed',
  })
}
