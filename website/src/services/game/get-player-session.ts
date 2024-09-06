import { type GameSession, type StorylineWithNarrative } from './types'

interface GetPlayerSessionResponse {
  storyline: StorylineWithNarrative
  session: GameSession
}
/**
 * Get the storyline + player session for a given player, storyline id and session id
 */
export async function getPlayerSession(args: {
  storylineId: string
  gameId: string
  player: string
}): Promise<GetPlayerSessionResponse> {
  const raw = await fetch(
    `${import.meta.env.MRU_ENDPOINT}/api/players/${args.player}/games/${args.storylineId}/sessions/${args.gameId}`,
  )
  const playerSession: GetPlayerSessionResponse = await raw.json()
  return playerSession
}
