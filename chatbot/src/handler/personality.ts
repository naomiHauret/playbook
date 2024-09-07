import { HandlerContext } from '@xmtp/message-kit'
import { PERSONALITY_TYPES } from '../utils/characters.js'

/**
 * Provides :
 * - the list of personality codes the player can use during character casting
 */
export async function handlerPersonality(context: HandlerContext) {
  const message = `Here are the different personality codes:\n\n${PERSONALITY_TYPES.map((personality, index) => `${index}: ${personality}\n`).join('')}\n\nType the personality code you want to use for this character in the frame input. For instance, input 3 for ${PERSONALITY_TYPES[3]}.`

  await context.send(message)
}
