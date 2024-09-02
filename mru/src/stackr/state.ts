import { State } from '@stackr/sdk/machine'
import { type BytesLike, solidityPackedKeccak256 } from 'ethers'

export interface StorylineCard {
  title: string
  description: string
  influence: number
  success_rate: number // Percentage from 0 to 100
  influence_rate: number // Percentage that modifies influence
}

export interface StorylineCardEventEffectApplier {
  value: number
  cond: null | 'always' | 'success' | 'failure'
}

export interface StorylineCardEventEffect {
  draw: StorylineCardEventEffectApplier
  discard: StorylineCardEventEffectApplier
  fish?: StorylineCardEventEffectApplier
}

export interface StorylineCardEvent {
  title: string
  description: string
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

export interface StorylineCharacterDecks {
  action: Record<string, StorylineCard>
  social: Record<string, StorylineCard>
}

export enum CharacterRole {
  protagonist = 'protagonist',
  antagonist = 'antagonist',
  support = 'support',
}

interface StorylineCharacter {
  name: string
  initial_role: CharacterRole
  description: string
  decks: StorylineCharacterDecks
}

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

export interface Storyline {
  title: string
  description: string
  characters: Record<string, StorylineCharacter>
  initial_situations_pile: Record<string, StorylineCardEvent>
  events_deck: Record<string, StorylineCardEvent>
}

export interface GameSession {
  status: 'preparing' | 'ready' | 'ongoing' | 'game_over' | 'complete'
  created_at: number
  started_at: number
  last_updated_at: number
  finished_at: number
  galadriel_contract_address: string
  characters: Record<string, CastedCharacter> // StorylineCharacter id => CastedCharacter
  current_event: {
    id: string
    current_influence_score: number
    current_turn: number
    play_order: Array<string>
  }
}

export interface AppState {
  // storylines: Record<string, Storyline>
  storylines: Array<string>
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
