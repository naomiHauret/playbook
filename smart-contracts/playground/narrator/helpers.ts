// Import ethers from Hardhat package
import { createWalletClient, http, defineChain, createPublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

export const galadrielDevnet = defineChain({
  id: 696969,
  name: 'Galadriel Devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'GAL',
    symbol: 'GAL',
  },
  rpcUrls: {
    default: {
      http: ['https://devnet.galadriel.com'],
      webSocket: ['wss://devnet.galadriel.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.galadriel.com' },
  },
})

export const deployerWalletClient = createWalletClient({
  chain: galadrielDevnet,
  transport: http(),
})

export const publicClient = createPublicClient({
  chain: galadrielDevnet,
  transport: http(),
})

// Deployer Account
export const deployerAccount = privateKeyToAccount(
  process.env.PRIVATE_KEY_GALADRIEL!! as `0x${string}`,
)

// Galadriel oracle
export const ORACLE_ADDRESS = process.env.ORACLE_ADDRESS

export interface Message {
  role: 'assistant' | 'system' | 'user'
  content: Array<{
    contentType: 'text'
    value: string
  }>
}
export async function getGameMessages(
  contract: {
    address: `0x${string}`
    abi: any
  },
  chatId: number,
) {
  const messages = (await publicClient.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: 'getMessageHistory',
    args: [chatId],
  })) as Array<Message>

  return messages
}
