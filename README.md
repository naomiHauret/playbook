# playbook

Entry for [ETHOnline 2024 hackathon](https://ethglobal.com/events/ethonline2024). 

> A text-based RPG where your NFTs become the stars of unique adventures. Pick a storyline, cast your NFTs in different roles, give them a personality type and alignment, and let card-based sequences drive the story. Finish the story to unlock new cards and new ways to play !

- LLM narrator smart contract: [Galadriel](https://docs.galadriel.com/overview) ;
- Game micro-rollup (finite state machine): [Stackr Labs](https://docs.stf.xyz/) (+ Elysia for the backend) ;
- Chatbot: XMTP [Messagekit](https://message-kit.vercel.app/)
- Website + frames : [Astro](https://docs.astro.build/en/getting-started/), [Alpine](https://alpinejs.dev/), [Opensea API](https://docs.opensea.io/reference/api-overview), [@onchainkit/frames](https://onchainkit.xyz/frame/get-frame-metadata), [XMTP JS SDK](https://github.com/xmtp/xmtp-js) (for messaging), [`viem`](https://viem.sh/)

## Technical overview 

- `smart-contracts/` : code for the smart contracts on which the game relies to run ;
- `chatbot/` : code for the chatbot used by end-users for interactions ;
- `mru/` : code for the micro-rollup used under the hood for the gameplay ;
- `website/` : code for the website and interactive frames (sent by the chatbot) ;

Check the `README.md` file of each folders above for running instructions, pre-requisites and implementation details.

## What is it ?

Remember when you were a kid and how you made up stories with toys that had nothing to do with each others ? Your favourite teddy bear had one role, barbies another role, action men another role, Pokémon figurines another… and somehow you managed to create a story that was able to entertain you (and maybe some of your friends) for a few hours.

_What if you could do the same with your NFTs ? Define who is who, how they think and react, and go on a cool adventure for a few hours ?_

This nostalgia is what inspired **Playbook** : a text-based RPG that relies on a cards deck system and the player's own NFTs to drive the story and recreate the childhood experience of playing with completely unrelated toys. _Kinda like Toy Story, but with text instead of movie - and Opensea_. 

The player picks a storyline, decide which of their NFTs will play what role (eg: the knight, the villain, the dragon, the love interest...), and gives them a unique personality type and alignment (chaotic neutral, lawful evil, neutral good etc.) that influence how they react and interact with the different situations and events in the story.

The gameplay revolves around drawing and playing cards from a deck (action and social sequences), with each NFT playing a different role in the storyline. A **storyline** defines narrative elements along with a specific set of characters and narrated events and actions via a **finite deck of cards**. Each event card has a set of 2 conditions for resolution: an **influence threshold** that must be met or exceeded, and a **maximum number of turns** for this influence to be reached.

Once the storyline is picked, the player then casts which of their NFTs will play what role in that storyline. Some of those characters will be controlled by the player - they are **protagonists**.

Each of those protagonists gets their own deck of cards, which is separated in 2 sub decks : one for active situations (like fights), another for social actions (eg: a discussion between the protagonists while traveling to their next destination). These cards have:

- Influence: The impact the card has on resolving the event.
- Success Rate: The likelihood of the card’s action being successful.
- Influence Rate: How much the success of the card influences the overall event resolution.

The game progresses in turns. Turn starts after the event card initialized. At the beginning of a turn, for each protagonists, the player will be able to perform a planning/tactical phase (draw or discard a card from either the social or action deck), and then an action phase where they play a card from their hand.

When all the characters involved in the current event performed their actions, the score for this turn is calculated. When the player uses a card, its effect on the current situation is determined by its success rate and influence. The combined influence of all the cards played during the turn determines if the event is successfully resolved or not.

Wheter an event was successfully resolved or not has direct on the player's deck with the following in-game consequences :
- drawing X number of cards from either their social deck, action deck or both ;
- discarding X number of cards from either their social deck, action deck or both ;
- fishing back X number of cards from either their social deck discard pile, action deck discard pile or both ;

The game can end in one of several ways:

- If all protagonists' decks are empty.
- If a critical event fails and leads to a catastrophic outcome.
- Successfully resolving all necessary events and completing the storyline.

For each event and in-game turn, a narrator recounts what happens to the player in their inbox.
This narrator is a LLM created right after the player first bootstrapped their game session.
The narrator is instructed to keep a coherent story that matches the storyline and events unrolled throughout the game.

## How does it work ?

The whole game is playable through [XMTP](https://xmtp.org/)-compatible chat apps, like [Converse](https://getconverse.app/) or [Coinbase Wallet](https://www.coinbase.com/wallet). By using specific slash commands or by simply pasting the URL of the Playbook website, the user is able to bootstrap a new game session for a specific storyline, cast their NFTs in the different roles, deploy and link an LLM narrator to their session, and play in draw cards (events, actions).

The in-between events/turns narration is ensured by a LLM deployed to Galadriel.
This LLM uses the gpt-4-turbo model, and uses 3 different prompts :


1. Initial system prompt: this prompt defines the context, rules, and behaviors the LLM should follow throughout the game. This prompt helps the LLM understand the nature of the storyline, the role of the characters, and the desired approach to generating dialogues and narratives.


2. Event setup prompt: this prompt fits-in story events in a coherent manner whenever a new event card is drawn or the next event in the sequence begins.

3. Turn update prompt: this prompt details the specific actions taken during a turn (cards played, outcomes) for generating dialogues and narratives.

The game itself is built on with a Stackr Labs micro-rollup. The player can update the state of the rollup (thus their information, game session etc) via API routes called from either the chatbot or a frame. The micro-rollup manages storylines, game sessions (save files), decks, turns... everything that has to do with the gameplay. For every state-altering action, the player has to sign a message in their wallet (triggered by a frame). This signature contains the "intention" (for instance "create a new game session", "link a contract address to my game session") is then sent back to the backend, verified, and the requested state alterations are applied.

This is all abstracted away from the player, who interacts with the game via their XMTP, open frames-compatible chat app.
Although the game is text-based, the frames, built with Astro and onchainkit/frames push the experience further, creating an "inline" experience where the user can use buttons to trigger events, input what card they would like to play etc.