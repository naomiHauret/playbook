import { deployerAccount, deployerWalletClient, ORACLE_ADDRESS, publicClient } from './config'
import { abi, bytecode } from './Narrator.json'
import { getPlayerSession } from './../game'
import { createSystemPrompt } from './prompts'
/**
 * Deploys an narrator contract to Galadriel
 * @param args Arguments to pass to the contract constructor arguments
 * @returns deployment receipt
 */
export async function deployNarratorContract(args: {
  storylineId: string
  gameId: string
  player: string
}) {
  const { storyline, session } = await getPlayerSession({
    storylineId: args.storylineId,
    gameId: args.gameId,
    player: args.player,
  })

  const prompt = createSystemPrompt({
    storyline,
    playerSession: session,
  })
  const hash = await deployerWalletClient.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    account: deployerAccount,
    args: [ORACLE_ADDRESS, prompt],
  })

  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  return receipt
}
