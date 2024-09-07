import { HandlerContext } from '@xmtp/message-kit'
import { ALIGNMENTS_DESCRIPTIONS, ALIGNMNENTS } from '../utils/characters.js'

/**
 * Provides :
 * - the list of alignment codes the player can use during character casting
 */
export async function handlerAlignment(context: HandlerContext) {
  const message = `Here are the different alignment codes:\n\n${ALIGNMNENTS.map((_alignement, index) => `${index}: ${_alignement} ;\n ${ALIGNMENTS_DESCRIPTIONS[_alignement]}\n\n`).join('')}\n\nType the alignment code you want to use for this character in the frame input. For instance, input 3 for ${ALIGNMNENTS[3]}.`

  await context.send(message)
}
