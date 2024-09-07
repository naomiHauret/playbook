import { run, type HandlerContext, type CommandHandlers } from '@xmtp/message-kit'
import { commands } from './commands.js'
import { handlerStorylines } from './handler/storylines.js'
import { handlerStoryline } from './handler/storyline.js'
import { handlerAbout } from './handler/about.js'
import { handlerPersonality } from './handler/personality.js'
import { handlerAlignment } from './handler/alignment.js'

const commandHandlers: CommandHandlers = {
  '/help': async (context: HandlerContext) => {
    const intro =
      '> Available commands:\n' +
      commands
        .flatMap((app) => app.commands)
        .map((command) => `${command.command} - ${command.description}`)
        .join('\n\n')
    context.reply(intro)
  },
  '/storylines': handlerStorylines,
  '/new': handlerStoryline,
  '/personality': handlerPersonality,
  '/alignment': handlerAlignment,
  '/about': handlerAbout,
}

const appConfig = {
  commands,
  commandHandlers: commandHandlers,
}

run(async (context: HandlerContext) => {
  const {
    client,
    message: {
      content: { content: text, params },
      typeId,
      sender,
    },
  } = context

  if (typeId !== 'text') {
    await context.intent(
      `> This input is not supported.\nType "/help" to get all the available commands.`,
    )

    return
  } else if (text.startsWith('/')) {
    await context.intent(text)
    return
  }
}, appConfig)
