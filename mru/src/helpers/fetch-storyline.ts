import type { AppState, Storyline } from '../stackr'

export async function fetchStoryline(params: {
  storylineId: string
  state: AppState
}): Promise<Storyline> {
  const { state, storylineId } = params
  const file = Bun.file(`storylines/${storylineId}.json`)
  const exists = await file.exists()

  if (!state.storylines.includes(storylineId) || !exists) {
    const storyline: Record<string, Storyline> = await file.json()
    const key = Object.keys(storyline)[0]
    return storyline[key]
  }

  throw new Error("This storyline doesn't exist or was deleted.")
}
