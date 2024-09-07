import { type StorylineWithNarrative } from './types'

interface GetStorylineResponse {
  storyline: StorylineWithNarrative
}
/**
 * Get a given storyline
 */
export async function getStoryline(args: { storylineId: string }): Promise<GetStorylineResponse> {
  const raw = await fetch(`${import.meta.env.MRU_ENDPOINT}/api/storylines/${args.storylineId}`)
  const storyline: GetStorylineResponse = await raw.json()
  return storyline
}
