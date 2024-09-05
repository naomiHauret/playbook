/**
 * We use Opensea API to get the player's NFTs
 * @see https://docs.opensea.io/reference/supported-chains Opensea docs for list of supported chains
 */
export enum OpenseaChains {
  // Arbitrum
  arbitrum = 'arbitrum',
  arbitrumNova = 'arbitrum_nova',
  arbitrumSepoliaTestnet = 'arbitrum_sepolia',
  // Avalanche
  avalanche = 'avalanche',
  avalancheFujiTestnet = 'avalanche_fuji',
  // Base
  base = 'base',
  baseSepoliaTestnet = 'base_sepolia',
  // Blast
  blast = 'blast',
  blastSepoliaTestnet = 'blast_sepolia',
  // Mainnet
  ethereum = 'ethereum',
  ethereumSepoliaTestnet = 'sepolia',
  // Klaytn
  klaytn = 'klaytn',
  klaytnBaobabTestnet = 'baobab',
  // Polygon
  polygonMatic = 'matic',
  polygonAmoyTestnet = 'amoy',
  // Optimism
  optimism = 'optimism',
  optimismSepoliaTestnet = 'optimism_sepolia',
  // Solana
  solana = 'solana',
  solanaTestnet = 'soldev',
  // Sei
  sei = 'sei',
  seiTestnet = 'sei_testnet',
  // Zora
  zora = 'zora',
  zoraSepoliaTestnet = 'zora_sepolia',
}

export const OPENSEA_CHAINS = {
  mainnets: {
    chains: [
      OpenseaChains.arbitrum,
      OpenseaChains.arbitrumNova,
      OpenseaChains.avalanche,
      OpenseaChains.base,
      OpenseaChains.blast,
      OpenseaChains.ethereum,
      OpenseaChains.klaytn,
      OpenseaChains.polygonMatic,
      OpenseaChains.optimism,
      OpenseaChains.solana,
      OpenseaChains.sei,
      OpenseaChains.zora,
    ],
    endpoint: 'https://api.opensea.io',
  },
  testnets: {
    chains: [
      OpenseaChains.arbitrumSepoliaTestnet,
      OpenseaChains.avalancheFujiTestnet,
      OpenseaChains.baseSepoliaTestnet,
      OpenseaChains.blastSepoliaTestnet,
      OpenseaChains.ethereumSepoliaTestnet,
      OpenseaChains.klaytnBaobabTestnet,
      OpenseaChains.polygonAmoyTestnet,
      OpenseaChains.optimismSepoliaTestnet,
      OpenseaChains.solanaTestnet,
      OpenseaChains.seiTestnet,
      OpenseaChains.zoraSepoliaTestnet,
    ],
    endpoint: 'https://testnets-api.opensea.io',
  },
}
export const NFTS_SUPPORTED_CHAINS = [
  // Include these for anyone that would like to test out the app (normally we should support all chains)
  OpenseaChains.solana,
  OpenseaChains.base,
  OpenseaChains.zora,
  OpenseaChains.ethereum,

  // Include testnets as the wallet I'm using does not have any mainnet NFTs
  OpenseaChains.ethereumSepoliaTestnet,
  OpenseaChains.zoraSepoliaTestnet,
  OpenseaChains.optimismSepoliaTestnet,
  OpenseaChains.baseSepoliaTestnet,
]

export const OPENSEA_API_KEY = import.meta.env.OPENSEA_API_KEY
