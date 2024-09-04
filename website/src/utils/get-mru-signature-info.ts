import type { TypedDataField } from 'ethers'

enum MruActionSchema {
  bootstrapGame = 'bootstrapGame',
  castCharacter = 'castCharacter',
  configureGameInfra = 'configureGameInfra',
  startGame = 'startGame',
  drawEvent = 'drawEvent',
  playTurn = 'playTurn',
}

type MRUSignature = {
  domain: {
    name: string
    version: string
    chainId: number
    verifyingContract: string
    salt: string
  }
  transitionToSchema: Record<string, string>
  schemas: Record<
    MruActionSchema,
    {
      types: Record<string, Array<TypedDataField>>
      primaryType: string
    }
  >
}
export async function getMRUSignatureInfo(): Promise<MRUSignature> {
  const raw = await fetch(`${import.meta.env.MRU_ENDPOINT}/mru/info`)
  const signatureInfo = await raw.json()
  return signatureInfo
}
