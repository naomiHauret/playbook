import { type Message } from './config'
import { getNewMessages } from './get-new-messages'
import { xmtpClient } from '../xmtp'

export async function sendNewNarratedMessages(args: {
  contract: any
  player: string
  chatId?: bigint
}) {
  const conversation = await xmtpClient.conversations.newConversation(args.player)

  const allMessages: Array<Message> = []
  let newResponse
  while (!newResponse) {
    const newMessages: Array<Message> = await getNewMessages({
      contract: args.contract,
      chatId: args.chatId ?? 0n,
      currentMessagesCount: allMessages.length,
    })
    if (newMessages) {
      for (const message of newMessages) {
        allMessages.push(message)
        console.log(`> ${new Date()}\n ${message.content}\n`)
        if (allMessages.at(-1)?.role === 'assistant') {
          newResponse = allMessages.at(-1)?.content
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
  console.log('response ', newResponse)
  //@ts-ignore
  const receipt = await conversation.send(newResponse)
  console.log(receipt.sent)
}
