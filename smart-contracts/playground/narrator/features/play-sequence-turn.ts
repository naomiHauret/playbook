import { abi } from '../../../artifacts/contracts/Narrator-Opus.sol/PlaybookNarrator.json'
import { getContract } from 'viem'
import * as enchantedForestStoryline from '../the-enchanted-forest.json'
import * as mruState from '../with-dumb-narrator.json'
import { deployerWalletClient, Message, publicClient } from '../helpers'
import { getNewMessages } from './get-messages'
import { createUpdateEventPrompt } from '../prompts'

async function playSequenceTurn(narratorContractAddress: `0x${string}`, chatId: bigint | string) {
  const contract = getContract({
    address: narratorContractAddress,
    abi,
    client: { public: publicClient, wallet: deployerWalletClient },
  })
  const initialEvent = enchantedForestStoryline.initial_situations_pile.I004

  const playerSession =
    mruState.players['0x44817B9B9d0b7Cd4aC7Eb7fb53E3184c4FAC0fb0'].games['the-enchanted-forest']
      .sessions['0x9b0700dcbb28662aa1f8bdcf9359e3aabdb071554b5aae48cbebcedfc80602ae']

  const promptPlayTurn = createUpdateEventPrompt({
    event: {
      title: initialEvent.title,
      description: initialEvent.description,
      status: 'ongoing',
      sequence: initialEvent.sequence as 'action' | 'mix' | 'idle' | 'social' | 'final',
    },
    characters: Object.keys(playerSession.characters).map((character) => {
      // @ts-ignore
      const card = playerSession.characters[character].hand[0]
      // @ts-ignore
      const cardDescription = enchantedForestStoryline.characters[character].decks.action[card]
        ? {
            // @ts-ignore
            title: enchantedForestStoryline.characters[character].decks.action[card].title,
            description:
              // @ts-ignore
              enchantedForestStoryline.characters[character].decks.action[card].description,
          }
        : {
            // @ts-ignore
            title: enchantedForestStoryline.characters[character].decks.social[card].title,
            description:
              // @ts-ignore
              enchantedForestStoryline.characters[character].decks.social[card].description,
          }
      return {
        // @ts-ignore
        name: playerSession.characters[character].nftName,
        // @ts-ignore
        role: playerSession.characters[character].role,
        // @ts-ignore
        archetype: enchantedForestStoryline.characters[character].name,
        action: {
          ...cardDescription,
          successful: Math.random() < 0.5,
        },
      }
    }),
  })

  const allMessages: Array<Message> = []
  let response
  while (!response) {
    const newMessages: Array<Message> = await getNewMessages(contract, chatId, allMessages.length)
    if (newMessages) {
      for (const message of newMessages) {
        allMessages.push(message)
        if (allMessages.at(-1)?.role === 'assistant') {
          response = allMessages.at(-1)?.content
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
}

if (process.env.NARRATOR_CONTRACT_ADDRESS)
  playSequenceTurn(process.env.NARRATOR_CONTRACT_ADDRESS!! as `0x${string}`, 0n)
