import type { AppState, StorylineWithNarrative } from '../stackr'

export async function fetchStoryline(params: {
  storylineId: string
  state: AppState
}): Promise<StorylineWithNarrative> {
  const { state, storylineId } = params
  const file = Bun.file(`storylines/${storylineId}.json`)
  const exists = await file.exists()

  if (Object.keys(state.storylines).includes(storylineId) && exists) {
    const storyline: StorylineWithNarrative = await file.json()
    return storyline
  }

  throw new Error("This storyline doesn't exist or was deleted.")
}
