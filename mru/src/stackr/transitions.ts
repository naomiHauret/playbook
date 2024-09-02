import { type STF, type Transitions } from '@stackr/sdk/machine'
import { PlaybookState } from './state'
import { hashMessage } from 'ethers'

type BootstrapNewGameInput = { storylineId: string; timestamp: number }

const bootstrapGame: STF<PlaybookState, BootstrapNewGameInput> = {
  handler: ({ state, inputs, msgSender, block, emit }) => {
    // Initialize the player's games if not already present
    if (!state.players[msgSender]) {
      state.players[msgSender] = {
        games: {}, // Initialize with an empty games object
      }
    } else if (!state.players[msgSender].games) {
      state.players[msgSender].games = {} // Initialize games if missing
    }

    // Generate game ID using a unique identifier
    const gameId = hashMessage(
      `${msgSender}::${block.timestamp}::${inputs.timestamp}::${inputs.storylineId}::${Object.keys(state.players[msgSender]?.games).length}`,
    )

    // Ensure the specific storyline exists in the player's games
    if (!state.players[msgSender].games[inputs.storylineId]) {
      state.players[msgSender].games[inputs.storylineId] = {
        sessions: {},
        decks_extra_cards: {}, // Initialize if missing
      }
    }

    // Add the new session with a unique gameId
    state.players[msgSender].games[inputs.storylineId].sessions[gameId] = {
      status: 'preparing',
      created_at: block.timestamp,
      started_at: 0,
      last_updated_at: 0,
      finished_at: 0,
      galadriel_contract_address: '',
      characters: {},
      current_event: {
        id: '',
        current_influence_score: 0,
        current_turn: 0,
        play_order: [],
      },
    }

    emit({
      name: 'GameSessionBootstrapped',
      value: {
        gameId,
        storylineId: inputs.storylineId,
        player: msgSender,
      },
    })

    return state
  },
}

export const transitions: Transitions<PlaybookState> = {
  bootstrapGame,
}
