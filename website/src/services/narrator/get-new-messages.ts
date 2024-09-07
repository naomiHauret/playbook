import { publicClient } from './config'

export interface Message {
  role: 'assistant' | 'system' | 'user'
  content: Array<{
    contentType: 'text'
    value: string
  }>
}

/**
 * Get new messages for a given chat in a game session
 */
export async function getNewMessages(args: {
  contract: any
  currentMessagesCount: number
  chatId?: bigint
}): Promise<Message[]> {
  const messages = (await publicClient.readContract({
    address: args.contract.address,
    abi: args.contract.abi,
    functionName: 'getMessageHistory',
    args: [0n], // by default we use 0n as the chat ID index, as for now we don't support reusing the same narrator contract (not in the scope of features for the hackathon)
  })) as Array<Message>

  const newMessages: Message[] = []
  messages.forEach((message: any, i: number) => {
    if (i >= args.currentMessagesCount) {
      newMessages.push({
        role: message.role,
        content: message.content[0].value,
      })
    }
  })
  return newMessages
}
