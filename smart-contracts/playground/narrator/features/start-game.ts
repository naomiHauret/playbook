import { abi } from '../../../artifacts/contracts/Narrator-Opus.sol/PlaybookNarrator.json'
import { getContract } from 'viem'
import * as enchantedForestStoryline from '../the-enchanted-forest.json'
import { deployerAccount, deployerWalletClient, Message, publicClient } from '../helpers'
import { createEventPrompt } from '../prompts'
import { getNewMessages } from './get-messages'

async function startGame(narratorContractAddress: `0x${string}`) {
  const contract = getContract({
    address: narratorContractAddress,
    abi,
    client: { public: publicClient, wallet: deployerWalletClient },
  })

  const initialEvent = enchantedForestStoryline.initial_situations_pile.I004
  const promptInitialEvent = createEventPrompt({
    storyEvent: {
      title: initialEvent.title,
      sequence: 'initial',
      description: initialEvent.description,
    },
  })

  const initialize = await publicClient.simulateContract({
    account: deployerAccount,
    address: contract.address,
    abi: contract.abi,
    functionName: 'startGame',
    args: [promptInitialEvent],
  })
  await deployerWalletClient.writeContract(initialize.request)
  const chatId = initialize.result

  const allMessages: Array<Message> = []
  let response
  while (!response) {
    const newMessages: Array<Message> = await getNewMessages(contract, chatId, allMessages.length)
    if (newMessages) {
      for (const message of newMessages) {
        allMessages.push(message)
        console.log(`> ${message.content}`)
        if (allMessages.at(-1)?.role === 'assistant') {
          response = allMessages.at(-1)?.content
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
}

if (process.env.NARRATOR_CONTRACT_ADDRESS)
  startGame(process.env.NARRATOR_CONTRACT_ADDRESS!! as `0x${string}`)
