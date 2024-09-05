# playbook

Entry for [ETHOnline 2024 hackathon](https://ethglobal.com/events/ethonline2024). 

> A text-based RPG where your NFTs become the stars of unique adventures. Pick a storyline, cast your NFTs in different roles, give them a personality type and alignment, and let card-based sequences drive the story. Finish the story to unlock new cards and new ways to play !

## Technical overview 

- `smart-contracts/` : code for the smart contracts on which the game relies to run ;
- `chatbot/` : code for the chatbot used by end-users for interactions ;
- `mru/` : code for the micro-rollup used under the hood for the gameplay ;
- `website/` : code for the website and interactive frames (sent by the chatbot) ;

Check the `README.md` file of each folders above for running instructions, pre-requisites and implementation details.

## What is it ?

Remember when you were a kid and how you made up stories with toys that had nothing to do with each others ? Your favourite teddy bear had one role, barbies another role, action men another role, Pokémon figurines another… and somehow you managed to create a story that was able to entertain you (and maybe some of your friends) for a few hours.

_What if you could do the same with your NFTs ? Define who is who, how they think and react, and go on a cool adventure for a few hours ?_

This is what **Playbook** is: a text-based RPG that relies on a cards deck system and ther player's own NFTs to drive the story and recreate the childhood experience of playing with completely unrelated toys. _Kinda like Toy Story, but with text instead of movie_. 

The player picks a storyline, decide which of their NFTs will play what role (eg: the knight, the villain, the dragon, the love interest...), and gives them a unique personality type and alignment (chaotic neutral, lawful evil, neutral good etc.) that influence how they react and interact with the different situations and events in the story.

The whole game is playable through [XMTP](https://xmtp.org/)-compatible chat apps, like [Converse](https://getconverse.app/) or [Coinbase Wallet](https://www.coinbase.com/wallet). Using specific commands in the app along with frames, the user is able to perform all different in-game actions and access information and help regarding their current game session. The gameplay revolves around drawing and playing cards from a deck (action and social sequences), with each NFT playing a different role in the storyline.

The game starts with the user selecting a **storyline**, which defines a specific set of characters, initial situations and events via a **finite deck of cards**. Each event card has a set of 2 conditions for resolution: an **influence threshold** that must be met or exceeded, and a **maximum number of turns** for this influence to be reached.

Once the storyline is picked, the player then casts which of their NFTs will play what role in that storyline. Some of those characters will be controlled by the player - they are **protagonists**.

Each of those protagonists gets their own deck of cards, which is separated in 2 sub decks : one for active situations (like fights), another for social actions (eg: a discussion between the protagonists while traveling to their next destination). These cards have:

- Influence: The impact the card has on resolving the event.
- Success Rate: The likelihood of the card’s action being successful.
- Influence Rate: How much the success of the card influences the overall event resolution.

The game progresses in turns. Turn starts after the event card initialized (for instance, it can force protagonist to discard a card from their hand). At the beginning of a turn, for each protagonists, the player will either draw from either the social or action deck, and play a card from their hand.

 Each protagonist can have up to 6 cards in their hand - if they have more, the player will have to discard cards in hand until reaching 6. Discarded cards may be recovered by certain abilities or events. The success of the card's action is determined by its success rate and influence. The combined influence of all cards played determines if the event is successfully resolved or not.

Wheter an event was successfully resolved or not has direct on the player's deck with the following in-game consequences :
- drawing X number of cards from either their social deck, action deck or both ;
- discarding X number of cards from either their social deck, action deck or both ;
- fishing back X number of cards from either their social deck discard pile, action deck discard pile or both ;

The game can end in one of several ways:

- If all protagonists' decks are empty.
- If a critical event fails and leads to a catastrophic outcome.
- Successfully resolving all necessary events and completing the storyline.

If the player manages to complete the storyline without a game over, they will receive new cards in their decks.

An LLM assumes the role of the narrator and progressively puts the story together, providing an unexpected, unique game experience to the player.

---
[x] bootstrap game session
[x] cast NFT
[x] deploy game infra (narrative AI)
[ ] start game
[ ] gameplay rounds
---
[ ] Customize narrative AI (smart contract)
---
[ ] rewards distribution