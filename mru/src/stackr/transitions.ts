import { type STF, type Transitions } from '@stackr/sdk/machine'
import { PlaybookState } from './state'
import { hashMessage } from 'ethers'
import arrayShuffle from 'array-shuffle'

type BootstrapNewGameInput = { storylineId: string; timestamp: number }

/**
 * Bootstraps (create a barebone version) a new game session for the signer for a given storyline
 */
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
      events_discard_pile: [],
      events_deck: Object.keys(state.storylines[inputs.storylineId].events_deck),
      characters: {},
      current_event: {
        id: '',
        current_influence_score: 0,
        turns: {},
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
        timestamp: inputs.timestamp,
      },
    })

    return state
  },
}

type CastCharacterInput = {
  storylineId: string
  gameId: string
  characterId: string
  personality: string
  alignment: string
  nftName: string
  nftId: string
  nftContractAddress: string
  chainId: string
  timestamp: number
}

/**
 * Casts a NFT as a character
 */
const castCharacter: STF<PlaybookState, CastCharacterInput> = {
  handler: ({ state, inputs, msgSender, block, emit }) => {
    const {
      gameId,
      storylineId,
      characterId,
      personality,
      alignment,
      timestamp,
      nftName,
      chainId,
      nftContractAddress,
      nftId,
    } = inputs
    const storyline = state.storylines[storylineId]
    const character = storyline.characters[characterId]

    // Initialize randomized decks and creates drawing piles and hands from it
    const actionDeck = arrayShuffle(Object.keys(character.decks.action))
    const actionHand = actionDeck.splice(0, 3)
    const socialDeck = arrayShuffle(Object.keys(character.decks.social))
    const socialHand = socialDeck.splice(0, 3)

    // Register casted character in the session
    state.players[msgSender].games[inputs.storylineId].sessions[gameId].characters[characterId] = {
      nftContractAddress,
      nftId,
      nftName,
      chainId,
      personality,
      alignment,
      role: character.initial_role,
      hand: [...actionHand, ...socialHand],
      decks: {
        action: {
          draw_pile: actionDeck,
          discard_pile: [],
        },
        social: {
          draw_pile: socialDeck,
          discard_pile: [],
        },
      },
    }

    state.players[msgSender].games[inputs.storylineId].sessions[gameId].last_updated_at = timestamp
    emit({
      name: 'CharacterCasted',
      value: {
        gameId,
        characterId,
        storylineId,
        nftId,
        nftName,
        chainId,
        nftContractAddress,
        personality,
        alignment,
        player: msgSender,
        timestamp,
      },
    })

    return state
  },
}

type ConfigureInfraInput = {
  storylineId: string
  gameId: string
  aiContractAddress: string
  timestamp: number
}

/**
 * Link narrator AI + other infra
 */
const configureGameInfra: STF<PlaybookState, ConfigureInfraInput> = {
  handler: ({ state, inputs, msgSender, block, emit }) => {
    const { gameId, storylineId, aiContractAddress, timestamp } = inputs

    // Register casted character in the session
    state.players[msgSender].games[inputs.storylineId].sessions[gameId].galadriel_contract_address =
      aiContractAddress
    state.players[msgSender].games[inputs.storylineId].sessions[gameId].last_updated_at = timestamp
    state.players[msgSender].games[inputs.storylineId].sessions[gameId].status = 'ready'

    emit({
      name: 'NarratorContractLinked',
      value: {
        storylineId,
        gameId,
        aiContractAddress,
        player: msgSender,
        timestamp,
      },
    })

    return state
  },
}

type DrawEventInput = {
  storylineId: string
  gameId: string
  timestamp: number
}

/**
 * Draw event card
 */
const drawEvent: STF<PlaybookState, DrawEventInput> = {
  handler: ({ state, inputs, msgSender, block, emit }) => {
    const { gameId, storylineId, timestamp } = inputs
    const storyline = state.storylines[storylineId]
    const session = state.players[msgSender].games[inputs.storylineId].sessions[gameId]
    let card
    switch (session.status) {
      case 'ready':
        // Draw from the initial event deck
        state.players[msgSender].games[inputs.storylineId].sessions[gameId].status = 'ongoing'
        let initialDeck = arrayShuffle(Object.keys(storyline.initial_situations_pile))
        // Get card index
        card = initialDeck.splice(0, 1)[0]
        break

      case 'ongoing':
        let eventsDeck = arrayShuffle(session.events_deck)
        // Get card index
        card = eventsDeck.splice(0, 1)[0]
        // Remove card from player's events deck
        state.players[msgSender].games[inputs.storylineId].sessions[gameId].events_deck = eventsDeck
        // Add to player's events discard pile
        state.players[msgSender].games[inputs.storylineId].sessions[gameId].events_discard_pile = [
          ...state.players[msgSender].games[inputs.storylineId].sessions[gameId]
            .events_discard_pile,
          card,
        ]
        // Update current event
        state.players[msgSender].games[inputs.storylineId].sessions[gameId].current_event = {
          current_turn: 0,
          current_influence_score: 0,
          id: card,
          turns: {},
          play_order: arrayShuffle(Object.keys(storyline.characters)),
        }
        break

      default:
        break
    }

    state.players[msgSender].games[inputs.storylineId].sessions[gameId].current_event
    emit({
      name: 'CardEventDrawn',
      value: {
        storylineId,
        gameId,
        card,
        player: msgSender,
        timestamp,
      },
    })

    return state
  },
}

export const transitions: Transitions<PlaybookState> = {
  bootstrapGame,
  castCharacter,
  configureGameInfra,
  drawEvent,
}
