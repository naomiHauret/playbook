import { abi } from './Narrator.json'
import { getContract } from 'viem'
import { deployerAccount, deployerWalletClient, publicClient } from './config'
import { createEventPrompt } from './prompts'
import { sendNewNarratedMessages } from './send-new-narrated-messages'
import { type StorylineCardEventWithNarrative } from '../game/types'
import { xmtpClient } from '../xmtp'

export async function startGame(args: {
  contractAddress: string
  narratedEvent: StorylineCardEventWithNarrative
  player: string
  nextAction: string
  game: {
    id: string
    current_influence_score: number
    current_turn: number
    turns: Record<
      number,
      Record<
        string,
        {
          before_play: {
            performed: boolean
            action: 'discard' | 'draw' | 'none'
          }
          discard: {
            cards: Array<{
              id: string
              deck: 'action' | 'social'
            }>
          }
          draw: {
            cards: Array<{
              id: string
              deck: 'action' | 'social'
            }>
          }
          play: {
            id: string
            deck: 'action' | 'social'
            succeeded: boolean
          } | null
        }
      >
    >
    involved: Array<string>
    play_order: Array<string>
  }
}) {
  const conversation = await xmtpClient.conversations.newConversation(args.player)
  await conversation.send(`> you draw "${args.narratedEvent.title}"\n...\n`)
  const contract = getContract({
    address: args.contractAddress as `0x${string}`,
    abi,
    client: { public: publicClient, wallet: deployerWalletClient },
  })

  const promptInitialEvent = createEventPrompt({ event: args.narratedEvent })

  const initialize = await publicClient.simulateContract({
    account: deployerAccount,
    address: contract.address,
    abi: contract.abi,
    functionName: 'startGame',
    args: [promptInitialEvent],
  })
  await deployerWalletClient.writeContract(initialize.request)
  const chatId = initialize.result
  await sendNewNarratedMessages({
    contract,
    player: args.player,
    chatId,
  })

  await conversation.send(args.nextAction)
}
