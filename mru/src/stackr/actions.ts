import { ActionSchema, SolidityType } from '@stackr/sdk'

enum MruActions {
  bootstrap = 'bootstrapGame',
  cast = 'castCharacter',
  configureInfra = 'configureGameInfra',
  startGame = 'startGame',
  drawEvent = 'drawEvent',
  playTurn = 'playTurn',
}
/**
 * Bootsrap a new game for a given storyline id
 */
const BootstrapNewGameSchema = new ActionSchema('bootstrapGame', {
  storylineId: SolidityType.STRING,
  timestamp: SolidityType.UINT,
})

/**
 * Cast an NFT in a role, assign it a personality and alignment
 */
const CastCharacterSchema = new ActionSchema('castCharacter', {
  storylineId: SolidityType.STRING,
  gameId: SolidityType.STRING,
  characterId: SolidityType.STRING,
  personality: SolidityType.STRING,
  alignment: SolidityType.STRING,
  role: SolidityType.STRING,
  nftName: SolidityType.STRING,
  nftId: SolidityType.STRING,
  nftContractAddress: SolidityType.ADDRESS,
  chainId: SolidityType.STRING,
})

/**
 * Configure infrastructure (narrative AI, etc) for the game
 */
const ConfigureGameInfraSchema = new ActionSchema('configureGameInfra', {
  aiContractAddress: SolidityType.ADDRESS,
  storylineId: SolidityType.STRING,
  gameId: SolidityType.STRING,
  timestamp: SolidityType.UINT,
})

/**
 * Start the game (draws characters set of cards, pick initial event card)
 */
const StartGameSchema = new ActionSchema('startGame', {
  storylineId: SolidityType.STRING,
  gameId: SolidityType.STRING,
  timestamp: SolidityType.UINT,
})

/**
 * Draw a random event card from the storyline event deck
 */
const DrawEventSchema = new ActionSchema('drawEvent', {
  storylineId: SolidityType.STRING,
  gameId: SolidityType.STRING,
  timestamp: SolidityType.UINT,
})

/**
 * During a turn, play a card for a given character
 */
const PlayTurnSchema = new ActionSchema('playTurn', {
  storylineId: SolidityType.STRING,
  gameId: SolidityType.STRING,
  castedCharacterId: SolidityType.STRING,
  playedCardId: SolidityType.STRING,
  timestamp: SolidityType.UINT,
})

export const schemas = {
  [MruActions.bootstrap]: BootstrapNewGameSchema,
  [MruActions.cast]: CastCharacterSchema,
  [MruActions.configureInfra]: ConfigureGameInfraSchema,
  [MruActions.startGame]: StartGameSchema,
  [MruActions.drawEvent]: DrawEventSchema,
  [MruActions.playTurn]: PlayTurnSchema,
}

export {
  BootstrapNewGameSchema,
  CastCharacterSchema,
  ConfigureGameInfraSchema,
  StartGameSchema,
  DrawEventSchema,
  PlayTurnSchema,
  MruActions,
}
