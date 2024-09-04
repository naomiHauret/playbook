import { z, defineCollection } from 'astro:content'

const _schemaStorylineCardEventEffectApplier = z.object({
  value: z.number(),
  cond: z.nullable(z.enum(['always', 'success', 'failure'])),
})
const _schemaStorylineCardEventEffect = z.object({
  draw: _schemaStorylineCardEventEffectApplier,
  discard: _schemaStorylineCardEventEffectApplier,
  fish: _schemaStorylineCardEventEffectApplier.optional(),
})

const _schemaStorylineCardEvent = z.object({
  title: z.string(),
  description: z.string(),
  sequence: z.enum(['initial', 'social', 'action', 'mix', 'idle', 'final']),
  effect: z.object({
    action: _schemaStorylineCardEventEffect,
    social: _schemaStorylineCardEventEffect,
    resolution: z
      .object({
        influence_threshold: z.number(),
        turn_limit: z.number(),
      })
      .optional(),
  }),
})
const _characterDeckSchema = z.record(
  z.string(),
  z.object({
    title: z.string(),
    description: z.string(),
    influence: z.number(),
    success_rate: z.number(),
    influence_rate: z.number(),
  }),
)

const _storylineCharacterSchema = z.object({
  name: z.string(),
  initial_role: z.enum(['protagonist', 'antagonist', 'support']),
  description: z.string(),
  decks: z.object({
    action: _characterDeckSchema,
    social: _characterDeckSchema,
  }),
})

export const storylineSchema = z.object({
  title: z.string(),
  description: z.string(),
  characters: z.record(z.string(), _storylineCharacterSchema),
  initial_situations_pile: z.record(z.string(), _schemaStorylineCardEvent),
  events_deck: z.record(z.string(), _schemaStorylineCardEvent),
})
const storylinesCollection = defineCollection({
  type: 'data',
  schema: storylineSchema,
})
export const collections = {
  storylines: storylinesCollection,
}

export type Storyline = z.infer<typeof storylineSchema>
