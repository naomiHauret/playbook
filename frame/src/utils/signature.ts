import { stackrConfig } from '../../../mru/stackr.config'

/**
 * Common values for signatures
 * Feels very hacking, but doing otherwise will result in a signature mismatch between the frame and the MRU
 */
export const COMMON_SIGNATURE = {
  chainId: 'eip155:11155111', // Need to use Sepolia for the signature, won't work otherwise
  domain: {
    ...stackrConfig.domain,
    chainId: 11155111,
    verifyingContract: '0x0000000000000000000000000000000000000000',
  },
}
