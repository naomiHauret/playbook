import { type STF, type Transitions } from '@stackr/sdk/machine'
import { PlaybookState, type GameSession, type StorylineCardEvent } from './state'
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
        involved: [],
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
    const actionDeck = shuffle(Object.keys(character.decks.action))
    const actionHand = actionDeck.splice(0, 3)
    const socialDeck = shuffle(Object.keys(character.decks.social))
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
    let card = ''
    switch (session.status) {
      case 'ready':
        // Draw from the initial event deck
        state.players[msgSender].games[inputs.storylineId].sessions[gameId].status = 'ongoing'
        let initialDeck = arrayShuffle(Object.keys(storyline.initial_situations_pile))

        // Get card index
        card = initialDeck.splice(0, 1)[0]

        state.players[msgSender].games[inputs.storylineId].sessions[
          gameId
        ].events_discard_pile.push(card)
        break

      case 'ongoing':
        let eventsDeck = arrayShuffle(session.events_deck)
        // Get card index
        card = eventsDeck.splice(0, 1)[0]
        // Remove card from player's events deck
        state.players[msgSender].games[inputs.storylineId].sessions[gameId].events_deck = eventsDeck
        // Add to player's events discard pile
        state.players[msgSender].games[inputs.storylineId].sessions[
          gameId
        ].events_discard_pile.push(card)
        // Update current event

        break

      default:
        break
    }

    const involvedCharacters: Array<string> = []
    Object.keys(storyline.characters).map((character) => {
      if (storyline.characters[character].involved.includes(card)) {
        involvedCharacters.push(character)
      }
    })
    state.players[msgSender].games[inputs.storylineId].sessions[gameId].current_event = {
      current_turn: 0,
      current_influence_score: 0,
      id: card,
      turns: {},
      involved: involvedCharacters,
      play_order: arrayShuffle(involvedCharacters),
    }
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

type PlayTurnInput = {
  storylineId: string
  gameId: string
  castedCharacterId: string // Always defined, but defaults to 'none' when not used
  cardId: string //  Always defined, but defaults to 'none' when not used
  planningAction: 'draw' | 'discard' | 'none' // Always defined (`none` when not used)
  deckType: 'action' | 'social' | 'none' // Specify deck type, defaults to 'none'
  actionType: 'planning' | 'playing' // distinguish between planning and playing phases
  timestamp: number
}

/**
 * Play a turn
 * Includes :
 * - character: performing a planning/tactical action (drawing or discarding a card - or none to jump straight to turn action)
 * - character: performing a turn action (playing a card)
 * - calculate score after character turn action
 * - resolve event (success/failure) if the conditions are met
 * - apply modifiers to the player's deck
 */
const playTurn: STF<PlaybookState, PlayTurnInput> = {
  handler: ({ state, inputs, msgSender, block, emit }) => {
    const {
      storylineId,
      gameId,
      castedCharacterId,
      cardId,
      planningAction,
      deckType,
      actionType,
      timestamp,
    } = inputs

    const storyline = state.storylines[storylineId]
    const gameSession = state.players[msgSender].games[storylineId].sessions[gameId]

    // Ensure the game is ongoing
    if (gameSession.status !== 'ongoing') {
      console.error('Session does not allow further actions right now.')
      return state
    }

    // Determine the current event source (initial or main event pile)
    const storylineEvent =
      gameSession.events_discard_pile.length > 1
        ? storyline.events_deck[gameSession.current_event.id]
        : storyline.initial_situations_pile[gameSession.current_event.id]

    // Handle idle sequence (Apply all "always" effects for the character decks)
    if (storylineEvent.sequence === 'idle') {
      gameSession.current_event.involved.forEach((characterId) => {
        const character = gameSession.characters[characterId]
        ;['action', 'social'].forEach((_deckType) => {
          const effect = storylineEvent.effect[_deckType as 'action' | 'social']

          // Apply draw effect
          if (effect.draw.cond === 'always' && effect.draw.value > 0) {
            let cardsToDraw = effect.draw.value
            while (
              cardsToDraw > 0 &&
              character.decks[_deckType as 'action' | 'social'].draw_pile.length > 0
            ) {
              const card = character.decks[_deckType as 'action' | 'social'].draw_pile.pop()
              character.hand.push(card!)
              cardsToDraw--
            }
          }

          // Apply discard effect
          if (effect.discard.cond === 'always' && effect.discard.value > 0) {
            let cardsToDiscard = effect.discard.value
            while (cardsToDiscard > 0 && character.hand.length > 0) {
              const cardIndex = Math.floor(Math.random() * character.hand.length)
              const [discardedCard] = character.hand.splice(cardIndex, 1)
              character.decks[_deckType as 'action' | 'social'].discard_pile.push(discardedCard)
              cardsToDiscard--
            }
          }

          // Apply fish effect
          if (effect.fish?.cond === 'always' && effect.fish.value > 0) {
            let cardsToFish = effect.fish.value
            while (
              cardsToFish > 0 &&
              character.decks[_deckType as 'action' | 'social'].discard_pile.length > 0
            ) {
              const card = character.decks[_deckType as 'action' | 'social'].discard_pile.pop()
              character.hand.push(card!)
              cardsToFish--
            }
          }
        })
      })

      emit({
        name: 'EventCompleted',
        value: {
          storylineId,
          eventId: gameSession.current_event.id,
          sequence: storylineEvent.sequence,
          gameId,
          player: msgSender,
          timestamp,
        },
      })
      return state
    }

    // Planning Phase: Handle drawing, discarding, or passing
    if (actionType === 'planning' && castedCharacterId !== 'none') {
      const character = gameSession.characters[castedCharacterId]
      let drawnCard
      if (planningAction === 'draw') {
        // Draw a card from the specified character deck and add it to its hand
        if (character.decks[deckType as 'action' | 'social'].draw_pile.length > 0) {
          const card = character.decks[deckType as 'action' | 'social'].draw_pile.pop()
          character.hand.push(card!)
          drawnCard = card
        }
      } else if (planningAction === 'discard' && cardId !== 'none') {
        // Remove a specific card from the specified character hand and add it to its specified discard pile
        const cardIndex = character.hand.indexOf(cardId)
        if (cardIndex !== -1) {
          const [discardedCard] = character.hand.splice(cardIndex, 1)
          character.decks[deckType as 'action' | 'social'].discard_pile.push(discardedCard)
        } else {
          console.error('Card not found in hand for discarding.')
          return state
        }
      }

      // Record the planning action
      const currentEvent = gameSession.current_event
      let turnIndex = currentEvent.current_turn

      if (!currentEvent.turns[turnIndex]) {
        currentEvent.turns[turnIndex] = {}
      }

      if (!currentEvent.turns[turnIndex][castedCharacterId]) {
        currentEvent.turns[turnIndex][castedCharacterId] = {
          before_play: {
            performed: true,
            action: 'none',
          },
          discard: {
            cards: [],
          },
          draw: {
            cards: [],
          },
          play: null,
        }
      }

      // Update planning actions based on type
      currentEvent.turns[turnIndex][castedCharacterId].before_play = {
        performed: true,
        action: planningAction,
      }

      // Update discard or draw logs based on action
      if (planningAction === 'discard') {
        currentEvent.turns[turnIndex][castedCharacterId].discard.cards.push({
          id: cardId,
          deck: deckType as 'action' | 'social',
        })
      } else if (planningAction === 'draw') {
        currentEvent.turns[turnIndex][castedCharacterId].draw.cards.push({
          id: drawnCard as string,
          deck: deckType as 'action' | 'social',
        })
      }

      gameSession.last_updated_at = timestamp
      state.players[msgSender].games[storylineId].sessions[gameId] = gameSession

      emit({
        name: 'PlanningPhaseCompleted',
        value: {
          storylineId,
          gameId,
          characterId: castedCharacterId,
          sequence: storylineEvent.sequence,
          eventId: gameSession.current_event.id,
          turn: gameSession.current_event.current_turn,
          player: msgSender,
          timestamp,
        },
      })

      return state
    }

    // Playing Phase: play card, update hand/discard pile, calculate score, check event resolution
    if (actionType === 'playing' && castedCharacterId !== 'none') {
      if (cardId === 'none') {
        console.error('No card played')
        return state
      }

      const character = gameSession.characters[castedCharacterId]

      if (!character.hand.includes(cardId)) {
        console.error('Invalid card or card not found in hand')
        return state
      }

      const isActionCard = storyline.characters[castedCharacterId].decks.action[cardId]?.influence
        ? true
        : false
      const cardDetails =
        storyline.characters[castedCharacterId].decks[isActionCard ? 'action' : 'social'][cardId]

      const successRoll = Math.random() * 100
      const isSuccess = successRoll <= cardDetails.success_rate

      const currentEvent = gameSession.current_event
      let turnIndex = currentEvent.current_turn

      // **Ensure the turn entry for the character is initialized**
      if (!currentEvent.turns[turnIndex]) {
        currentEvent.turns[turnIndex] = {}
      }

      // **Ensure the character entry for the turn is initialized**
      if (!currentEvent.turns[turnIndex][castedCharacterId]) {
        currentEvent.turns[turnIndex][castedCharacterId] = {
          before_play: {
            performed: true,
            action: 'none',
          },
          discard: {
            cards: [],
          },
          draw: {
            cards: [],
          },
          play: null,
        }
      }

      currentEvent.turns[turnIndex][castedCharacterId].play = {
        id: cardId,
        deck: isActionCard ? 'action' : 'social',
        succeeded: isSuccess,
      }

      const influenceChange = isSuccess
        ? cardDetails.influence * (cardDetails.influence_rate / 100)
        : 0
      gameSession.current_event.current_influence_score += influenceChange

      gameSession.current_event.play_order = gameSession.current_event.play_order.filter(
        (characterId) => characterId !== castedCharacterId,
      )

      if (gameSession.current_event.play_order.length === 0) {
        const isResolved = storylineEvent.effect?.resolution
          ? currentEvent.current_influence_score >=
            storylineEvent.effect.resolution.influence_threshold
          : false

        const isFailed = storylineEvent.effect?.resolution?.turn_limit
          ? currentEvent.current_turn >= storylineEvent.effect?.resolution?.turn_limit &&
            !isResolved
          : false

        if (isResolved) {
          applyEffects('success', storylineEvent, gameSession)
        } else if (isFailed) {
          applyEffects('failure', storylineEvent, gameSession)
        } else {
          false
          currentEvent.current_turn++
          currentEvent.play_order = shuffle(currentEvent.involved)
        }
      }

      gameSession.last_updated_at = timestamp
      state.players[msgSender].games[storylineId].sessions[gameId] = gameSession

      emit({
        name: 'TurnEnded',
        value: {
          storylineId,
          gameId,
          cardId,
          eventId: gameSession.current_event.id,
          sequence: storylineEvent.sequence,
          characterId: castedCharacterId,
          player: msgSender,
          timestamp,
        },
      })

      return state
    }

    return state
  },
}

// Apply effects function to handle success/failure after event situation resolution
function applyEffects(
  result: 'success' | 'failure',
  storylineEvent: StorylineCardEvent,
  gameSession: GameSession,
) {
  gameSession.current_event.involved.forEach((characterId) => {
    const character = gameSession.characters[characterId]
    ;['action', 'social'].forEach((deckType) => {
      const effect = storylineEvent.effect[deckType as 'action' | 'social']

      // Apply draw effect
      if (effect.draw.cond === result && effect.draw.value > 0) {
        let cardsToDraw = effect.draw.value
        while (
          cardsToDraw > 0 &&
          character.decks[deckType as 'action' | 'social'].draw_pile.length > 0
        ) {
          const card = character.decks[deckType as 'action' | 'social'].draw_pile.pop()
          character.hand.push(card!)
          cardsToDraw--
        }
      }

      // Apply discard effect
      if (effect.discard.cond === result && effect.discard.value > 0) {
        let cardsToDiscard = effect.discard.value
        while (cardsToDiscard > 0 && character.hand.length > 0) {
          const cardIndex = Math.floor(Math.random() * character.hand.length)
          const [discardedCard] = character.hand.splice(cardIndex, 1)
          character.decks[deckType as 'action' | 'social'].discard_pile.push(discardedCard)
          cardsToDiscard--
        }
      }

      // Apply fish effect
      if (effect.fish?.cond === result && effect.fish.value > 0) {
        let cardsToFish = effect.fish.value
        while (
          cardsToFish > 0 &&
          character.decks[deckType as 'action' | 'social'].discard_pile.length > 0
        ) {
          const card = character.decks[deckType as 'action' | 'social'].discard_pile.pop()
          character.hand.push(card!)
          cardsToFish--
        }
      }
    })
  })
}

function shuffle(array: Array<any>) {
  return arrayShuffle(array)
}

export const transitions: Transitions<PlaybookState> = {
  bootstrapGame,
  castCharacter,
  configureGameInfra,
  drawEvent,
  playTurn,
}
