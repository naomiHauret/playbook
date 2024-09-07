import { HandlerContext } from '@xmtp/message-kit'

/**
 * Provides :
 * - list of all available storylines along with an example of how to start a new session
 */
export async function handlerStorylines(context: HandlerContext) {
  const raw = await fetch(`${process.env.MRU_URL}/api/storylines`)
  const storylines = (await raw.json()) as Array<{
    title: string
    description: string
  }>

  const list = storylines?.map((entry: { title: string }, index: number) => {
    const storyline = entry
    return `${index + 1}. ${storyline.title}`
  })

  const message = `${storylines?.length > 1 ? `There are currently ${storylines?.length} storylines you can play :` : `There is currently ${storylines?.length} storyline you can play :`}\n\n${list.join('')}\n\nType "/start [number]" to start a new session.\nFor instance, /start 1 to start playing "${storylines?.[0]?.title}" storyline.`
  await context.send(message)
}
