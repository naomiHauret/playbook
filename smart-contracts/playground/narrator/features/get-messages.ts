import { Message, publicClient } from '../helpers'

export async function getNewMessages(
  contract: any,
  chatId: bigint | string,
  currentMessagesCount: number,
): Promise<Message[]> {
  const messages = (await publicClient.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: 'getMessageHistory',
    args: [chatId],
  })) as Array<Message>

  const newMessages: Message[] = []
  messages.forEach((message: any, i: number) => {
    if (i >= currentMessagesCount) {
      newMessages.push({
        role: message.role,
        content: message.content[0].value,
      })
    }
  })
  return newMessages
}
