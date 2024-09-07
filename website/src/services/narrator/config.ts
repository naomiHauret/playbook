import { createWalletClient, http, defineChain, createPublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

/**
 * Define Galadriel Devnet custom chain
 * @see https://docs.galadriel.com/setting-up-a-wallet#connect-manually Galadriel docs for complete chain configuration
 * @see https://viem.sh/docs/chains/introduction#custom-chains viem docs for setting up a custom chain
 */
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
export const deployerAccount = privateKeyToAccount(import.meta.env.PRIVATE_KEY_NARRATOR_DEPLOYER)

// Galadriel oracle
export const ORACLE_ADDRESS = import.meta.env.NARRATOR_ORACLE_CONTRACT_ADDRESS

export interface Message {
  role: 'assistant' | 'system' | 'user'
  content: Array<{
    contentType: 'text'
    value: string
  }>
}
