export const PERSONALITY_TYPES = [
  'Optimistic',
  'Pious',
  'Spiritual',
  'Jokester',
  'Caring',
  'Friendly',
  'Gracious',
  'Humble',
  'Unpredictable',
  'Mysterious',
  'Carefree',
  'Aggressive',
  'Cold',
  'Moody',
  'Pompous',
  'Selfish',
  'Snarky',
  'Greedy',
  'Impatient',
]
enum Alignments {
  'Lawful Good' = 'Lawful Good',
  'Neutral Good' = 'Neutral Good',
  'Chaotic Good' = 'Chaotic Good',
  'Lawful Neutral' = 'Lawful Neutral',
  'True Neutral' = 'True Neutral',
  'Chaotic Neutral' = 'Chaotic Neutral',
  'Lawful Evil' = 'Lawful Evil',
  'Neutral Evil' = 'Neutral Evil',
  'Chaotic Evil' = 'Chaotic Evil',
}

export const ALIGNMENTS_DESCRIPTIONS = {
  [Alignments['Lawful Good']]:
    'A lawful good character typically acts with compassion and always with honor and a sense of duty. However, lawful good characters will often regret taking any action they fear would violate their code, even if they recognize such action as being good.',
  [Alignments['Neutral Good']]:
    'A neutral good character typically acts altruistically, without regard for or against lawful precepts such as rules or tradition. A neutral good character has no problems with cooperating with lawful officials, but does not feel beholden to them. In the event that doing the right thing requires the bending or breaking of rules, they do not suffer the same inner conflict that a lawful good character would.',
  [Alignments['Chaotic Good']]:
    'A chaotic good character does whatever is necessary to bring about change for the better, disdains bureaucratic organizations that get in the way of social improvement, and places a high value on personal freedom, not only for oneself but for others as well. Chaotic good characters usually intend to do the right thing, but their methods are generally disorganized and often out of sync with the rest of society',
  [Alignments['Lawful Neutral']]:
    'A lawful neutral character typically believes strongly in lawful concepts such as honor, order, rules, and tradition, but often follows a personal code in addition to, or even in preference to, one set down by a benevolent authority',
  [Alignments['True Neutral']]:
    'A neutral character is neutral on both axes and tends not to feel strongly towards any alignment, or actively seeks their balance',
  [Alignments['Chaotic Neutral']]:
    'A chaotic neutral character is an individualist who follows their own heart and generally shirks rules and traditions. Although chaotic neutral characters promote the ideals of freedom, it is their own freedom that comes first; good and evil come second to their need to be free.',
  [Alignments['Lawful Evil']]:
    'A lawful evil character sees a well-ordered system as being necessary to fulfill their own personal wants and needs, using these systems to further their power and influence',
  [Alignments['Neutral Evil']]:
    "A neutral evil character is typically selfish and has no qualms about turning on allies-of-the-moment, and usually makes allies primarily to further their own goals. A neutral evil character has no compunctions about harming others to get what they want, but neither will they go out of their way to cause carnage or mayhem when they see no direct benefit for themselves. Another valid interpretation of neutral evil holds up evil as an ideal, doing evil for evil's sake and trying to spread its influence.",
  [Alignments['Chaotic Evil']]:
    "A chaotic evil character tends to have no respect for rules, other people's lives, or anything but their own desires, which are typically selfish and cruel. They set a high value on personal freedom, but do not have much regard for the lives or freedom of other people.",
}

export const ALIGNMNENTS = [
  Alignments['Lawful Good'],
  Alignments['Neutral Good'],
  Alignments['Chaotic Good'],
  Alignments['Lawful Neutral'],
  Alignments['True Neutral'],
  Alignments['Chaotic Neutral'],
  Alignments['Lawful Evil'],
  Alignments['Neutral Evil'],
  Alignments['Chaotic Evil'],
]
