import { run, HandlerContext } from '@xmtp/message-kit'
import { tunnelmole } from 'tunnelmole'

const url = process.env.NODE_ENV !== 'production' ? await tunnelmole({
  port: 5173
}) : process.env.FRAME_URL

console.log(`Frame running  at ${url} ; open ${url}/dev to debug`)

run(async (context: HandlerContext) => {
  // Get the message and the address from the sender
  const { content, sender } = context.message

  // To reply, just call `reply` on the HandlerContext.
  await context.reply(url)
})
