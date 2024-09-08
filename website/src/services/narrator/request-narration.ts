import { abi } from './Narrator.json'
import { getContract } from 'viem'
import { deployerAccount, deployerWalletClient, publicClient } from './config'
import { createUpdateEventPrompt } from './prompts'
import { sendNewNarratedMessages } from './send-new-narrated-messages'
import { type StorylineCardEventWithNarrative } from '../game/types'
import { xmtpClient } from '../xmtp'

export async function requestTurnNarration(args:{
    narratorContractAddress:  string
    player: string
    nextAction: string
    event: StorylineCardEventWithNarrative
    status: "ongoing" | "resolved" | "failed"
    characters: Array<{
        name: string
        role: string
        archetype: string
        action: {
          title: string
          description: string
          successful: boolean
        }
      }>
    

}) {
        const conversation = await xmtpClient.conversations.newConversation(args.player)
        await conversation.send(`> the narrator takes a deep breath...`)
      
    const promptPlayTurn = createUpdateEventPrompt({
        event: args.event,
        status: args.status,
        characters: args.characters
      })
    const contract = getContract({
        address: args.narratorContractAddress as `0x${string}`,
        abi,
        client: { public: publicClient, wallet: deployerWalletClient },
      })        

    
      const chatId = 0n // use 0n by default for now
      const updateEventNarration = await publicClient.simulateContract({
        account: deployerAccount,
        address: contract.address,
        abi: contract.abi,
        functionName: 'addMessage',
        args: [promptPlayTurn, chatId],
      })
      const updateEventNarrationTx = await deployerWalletClient.writeContract(
        updateEventNarration.request,
      )
      

        // Get back narrated version from the LLM and send it to the player
  await sendNewNarratedMessages({
    contract,
    player: args.player,
    chatId,
  })
      
      

  await conversation.send(args.nextAction)  
  

}