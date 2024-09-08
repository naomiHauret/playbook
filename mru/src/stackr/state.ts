import { State } from '@stackr/sdk/machine'
import { type BytesLike, solidityPackedKeccak256 } from 'ethers'

/**
 * Storyline character action card
 * Characters can perform action via a card
 * The action will :
 * - have a certain chance of being successful or not (% defined in `success_rate`)
 * - have a weighted influence on resolving the current event (score defined as `influence`, weight defined as `influence_rate`)
 */
export interface StorylineCardCharacterAction {
  influence: number
  success_rate: number // Percentage from 0 to 100
  influence_rate: number // Percentage that modifies influence
}

/**
 * Storyline event card effect applier
 * An event card is what drives the game/story
 * At the end of the sequence depending, on the condition of the card (`StorylineCardEventEffectApplier`), player's deck with evolve with the effect defined
 * `value`: amount of cards affected
 * `cond`: condition for the effect to be applied (success, failure, none, always)
 */
export interface StorylineCardEventEffectApplier {
  value: number
  cond: null | 'always' | 'success' | 'failure'
}

/**
 * Storyline event card effect
 * An event card is what drives the game/story
 * At the end of the sequence depending, on the condition of the card (`StorylineCardEventEffectApplier`), player's deck with evolve with the effect defined
 * `draw`: draw card(s) from the designed deck (social or action)
 * `discard`: draw card(s) from the designed deck (social or action)
 * `fish`: fish back card(s) from the designed deck (social or action) discard pile
 */
export interface StorylineCardEventEffect {
  draw: StorylineCardEventEffectApplier
  discard: StorylineCardEventEffectApplier
  fish?: StorylineCardEventEffectApplier
}

/**
 * Storyline event card (without narrative elements)
 * An event card is what drives the game/story
 * Depending on the sequence type, the player will have to use different cards from their character deck
 * The goal (if applicable, depending on the sequence type), is to reach a score (`influence_threshold`) within the number of turns defined (`turn_limit`)
 */
export interface StorylineCardEvent {
  sequence: 'initial' | 'action' | 'social' | 'mix' | 'idle' | 'final'
  effect: {
    action: StorylineCardEventEffect
    social: StorylineCardEventEffect
    resolution?: {
      influence_threshold: number
      turn_limit: number
    }
  }
}

/**
 * Storyline characters decks
 * There are 2 types of decks: social decks and action decks
 * Depending on the sequence type currently played, the player will use draw/discard cards from either deck
 */
export interface StorylineCharacterDecks {
  action: Record<string, StorylineCardCharacterAction>
  social: Record<string, StorylineCardCharacterAction>
}

/**
 * Storyline characters can have a role and certain events can change that role
 * The player can play as them or not depending on the character role ("protagonist" = playable)
 */
export enum CharacterRole {
  protagonist = 'protagonist',
  antagonist = 'antagonist',
  support = 'support',
}

/**
 * Storyline character (without narrative elements)
 * Characters can perform different action via their deck
 * The player can play as them or not depending on the character role ("protagonist" = playable)
 */
interface StorylineCharacter {
  initial_role: CharacterRole
  involved: Array<string>
  decks: StorylineCharacterDecks
}

export type CastedCharacterEventActivities = Array<{
  id: string
  deck: 'action' | 'social'
  succeeded: boolean
}>

/**
 * Playable storyline (without narrative elements)
 */
export interface CastedCharacter {
  nftId: string
  nftName: string
  nftContractAddress: string
  chainId: string
  personality: string
  alignment: string
  role: CharacterRole
  hand: Array<string>
  decks: {
    action: {
      draw_pile: Array<string>
      discard_pile: Array<string>
    }
    social: {
      draw_pile: Array<string>
      discard_pile: Array<string>
    }
  }
}

/**
 * Playable storyline (without narrative elements)
 */
export interface Storyline {
  characters: Record<string, StorylineCharacter>
  initial_situations_pile: Record<string, StorylineCardEvent>
  events_deck: Record<string, StorylineCardEvent>
}

/**
 * Player's game session (game save file)
 */
export interface GameSession {
  status: 'preparing' | 'ready' | 'ongoing' | 'game_over' | 'complete'
  created_at: number
  started_at: number
  last_updated_at: number
  finished_at: number
  galadriel_contract_address: string
  characters: Record<string, CastedCharacter> // StorylineCharacter id => CastedCharacter
  events_discard_pile: Array<string>
  events_deck: Array<string>
  current_event: {
    id: string
    current_influence_score: number
    current_turn: number
    turns: Record<
      number,
      Record<
        string,
        {
          before_play: {
            performed: boolean
            action: 'discard' | 'draw' | 'none'
          }
          discard: {
            cards: Array<{ id: string; deck: 'action' | 'social' }>
          }
          draw: {
            cards: Array<{ id: string; deck: 'action' | 'social' }>
          }
          play: {
            id: string
            deck: 'action' | 'social'
            succeeded: boolean
          } | null
        }
      >
    >
    involved: Array<string>
    play_order: Array<string>
  }
}

/**
 * Game state
 */
export interface AppState {
  // storylines: Record<string, Storyline>
  storylines: Record<string, Storyline>
  players: Record<
    string,
    {
      games: Record<
        string,
        {
          sessions: Record<string, GameSession>
          decks_extra_cards: Record<string, StorylineCharacterDecks> // id storyline => id character => Decks
        }
      >
    }
  >
}

export class PlaybookState extends State<AppState> {
  constructor(state: AppState) {
    super(state)
  }

  getRootHash(): BytesLike {
    return solidityPackedKeccak256(['string'], [JSON.stringify(this.state)])
  }
}

// The following types are applicable if we store the narrative elements of the deck
export interface StorylineCardEventWithNarrative extends StorylineCardEvent {
  title: string
  description: string
}

export interface StorylineCardCharacterActionWithNarrative extends StorylineCardCharacterAction {
  title: string
  description: string
}

export interface StorylineCharacterWithNarrative extends StorylineCharacter {
  name: string
  description: string
}

export interface StorylineWithNarrative {
  title: string
  description: string
  characters: Record<string, StorylineCharacterWithNarrative>
  initial_situations_pile: Record<string, StorylineCardEventWithNarrative>
  events_deck: Record<string, StorylineCardEventWithNarrative>
}
