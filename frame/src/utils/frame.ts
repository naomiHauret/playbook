export enum ROUTES {
  // Regular frames
  pickStoryline = '/',
  bootstrap = '/bootstrap',
  casting = '/casting',

  // Transitional frames (eg: transaction, signatures)
  signBootstrap = '/signBootstrap',
}

export enum STATE_PROPERTIES {
  storylineId = 'storylineId',
  gameId = 'gameId',
  timestamp = 'timestamp',
}

/**
 * Frame state management
 */
export type State = {
  storylineId?: string
  gameId?: string
  timestamp?: number
}
