import { NFTS_SUPPORTED_CHAINS, OPENSEA_API_KEY, OPENSEA_CHAINS } from './config'

export type OpenseaNfts = {
  identifier: string
  collection: string
  contract: string
  token_standard: string
  name: string
  description: string
  image_url: string
  display_image_url: string
  display_animation_url: string
  metadata_url: string
  opensea_url: string
  updated_at: string
  is_disabled: boolean
  is_nsfw: boolean
}
type GetOpenseaNftsByWalletResponse = {
  nfts: Array<OpenseaNfts>
  next: string
}

/**
 * Get the list of NFTs owned by a wallet for the supported chains
 * @param wallet - wallet address to get the list of owned nfts from
 * @returns list of nfts by chain
 */
export async function getAllNftsByAddress(wallet: string) {
  let nftsByChain: Record<string, Array<OpenseaNfts>> = {}
  const results = await Promise.allSettled(
    NFTS_SUPPORTED_CHAINS.map(async (chain) => {
      const endpoint = OPENSEA_CHAINS.mainnets.chains.includes(chain)
        ? OPENSEA_CHAINS.mainnets.endpoint
        : OPENSEA_CHAINS.testnets.endpoint
      const raw = await fetch(`${endpoint}/api/v2/chain/${chain}/account/${wallet}/nfts`, {
        headers: {
          accept: 'application/json',
          'x-api-key': OPENSEA_API_KEY,
        },
      })

      const result: GetOpenseaNftsByWalletResponse = await raw.json()
      return result.nfts
    }),
  )

  results.map((result, index) => {
    const chain = NFTS_SUPPORTED_CHAINS[index]
    if (result.status === 'fulfilled') nftsByChain[chain] = result?.value ?? []
  })

  return nftsByChain
}
