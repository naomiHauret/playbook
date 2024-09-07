import { HandlerContext } from '@xmtp/message-kit'

/**
 * Provides :
 * - information for a given storyline using a human-friendly numerical index instead of a slug
 * - a frame that allows the player to bootstrap a new game session using this storyline
 */
export async function handlerStoryline(context: HandlerContext) {
  const rawStorylines = await fetch(`${process.env.MRU_URL}/api/storylines`)
  const storylines = (await rawStorylines.json()) as Array<{
    id: string
    title: string
    description: string
    casting: number
  }>
  const { content } = context.message
  const {
    params: { storyline },
    content: text,
  } = content
  const index = storyline - 1

  const data = storylines[index]

  const message =
    `~~ ${data.title} ~~\n\n"${data.description}"\n\nThis storyline requires you to hold ${data.casting} NFTs.\n\nTap the "Pick this storyline" button to start your next game with this storyline.\n\n${process.env.FRAME_URL}/storylines/${data.id}`.trim()
  await context.send(message)
}
