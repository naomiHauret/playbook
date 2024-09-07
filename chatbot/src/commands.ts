import type { CommandGroup } from '@xmtp/message-kit'

export const commands: CommandGroup[] = [
  {
    name: 'Use Playbook',
    icon: '💸',
    description: 'Use these commands to play',
    commands: [
      {
        command: '/menu',
        description: 'List all the commands available to interact with Playbook.',
        params: {},
      },
      {
        command: '/about',
        description: 'Get to know everything about Playbook.',
        params: {},
      },
      {
        command: '/storylines',
        description: 'Get the list of all storylines available to play.',
        params: {},
      },
      {
        command: '/new [storyline]',
        description: 'Start a new game following a specific storyline',
        params: {
          storyline: {
            default: '',
            type: 'number',
          },
        },
      },
      {
        command: '/personality',
        description: 'Display the list of personalities along with their code.',
        params: {},
      },
      {
        command: '/alignment',
        description: 'Display the list of alignments along with their code.',
        params: {},
      },
    ],
  },
]
