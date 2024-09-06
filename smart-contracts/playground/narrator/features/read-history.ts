import { deployerWalletClient, Message, publicClient } from '../helpers'
import { abi } from '../../../artifacts/contracts/Narrator-Opus.sol/PlaybookNarrator.json'
import { getContract } from 'viem'

async function readHistory(narratorContractAddress: `0x${string}`, chatId: string | bigint) {
  const contract = getContract({
    address: narratorContractAddress,
    abi,
    client: { public: publicClient, wallet: deployerWalletClient },
  })

  const messages = (await publicClient.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: 'getMessageHistory',
    args: [chatId],
  })) as Array<Message>

  messages.map((message) => {
    console.log(message.content[0].value)
    console.log('\n\n')
  })
}
if (process.env.NARRATOR_CONTRACT_ADDRESS)
  readHistory(process.env.NARRATOR_CONTRACT_ADDRESS!! as `0x${string}`, 0n)
