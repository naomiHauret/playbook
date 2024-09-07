import { HandlerContext } from '@xmtp/message-kit'

/**
 * Provides :
 * - information about Playbook
 * - a frame that allows the player to list storylines
 */
export async function handlerAbout(context: HandlerContext) {
  const message = `Hey - I'm Playbook, an interactive text-based role-playing game chatbot.\n\nLet me embark you on a journey where every choice shapes the story and every decision can change how it will end.\nWhether you find yourself in a mystical forest, a haunted castle, or a war-torn kingdom, your actions will determine the outcome of the adventure that awaits !\n
How does it work ?\n1.Pick your storyline: choose from a list of unique storylines, each with its own setting, challenges, and characters. From magical realms to futuristic cities, the world you enter is up to you!\n2. Cast your characters: Use your own NFTs to cast the characters in the story. Decide their roles, personalities, and alignments, and watch as they come to life in the narrative.\nFace dynamic events: As you progress, you'll encounter events that require you to make strategic choices, play action or social cards, and use your characters’ abilities to navigate the story. Your decisions will lead to different paths, revealing secrets or new challenges.\n3. Plan and act: Every turn, decide your characters’ actions — draw new cards, discard old ones, or play a critical move. Be smart and strategic, as each decision can bring new opportunities or unexpected dangers.\n4. Unravel the Story: With each event, you’ll uncover more about the world you’ve entered, the characters you control, and the forces at play. Discover hidden truths, forge alliances, and prepare for twists you never saw coming!\n\n** Are you ready to begin ? **\n\n${process.env.FRAME_URL}`

  await context.send(message)
}
