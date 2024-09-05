import { deployerAccount, deployerWalletClient, ORACLE_ADDRESS, publicClient } from './config'
import { abi, bytecode } from './Narrator.json'

/**
 * Deploys an AI narrator contract to Galadriel
 * @param args Arguments to pass to the contract constructor arguments
 * @returns deployment receipt
 */
export async function deployNarratorContract(args?: any) {
  const hash = await deployerWalletClient.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    account: deployerAccount,
    args: [ORACLE_ADDRESS],
  })

  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  return receipt
}
