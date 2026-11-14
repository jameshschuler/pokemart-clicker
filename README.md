# PokéMart Clicker

An idle clicker game. You start a PokéMart in Pallet Town and grow it into a franchise across Kanto.

Click the register to serve customers. Buy producers, starting with flyers around Pallet Town, so sales keep coming while you're away. You're building a PokéMart franchise; the game is being rebuilt one piece at a time. Register upgrades make each click worth more, and achievements add a small permanent boost to all sales.

Game design lives in [DESIGN.md](DESIGN.md). Working notes for contributors are in [CLAUDE.md](CLAUDE.md).

## Running it

```sh
npm install
npm run dev      # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm test` | Vitest |
| `npm run build` | Typecheck and production build |
| `npm run lint` | oxlint |

Progress saves to localStorage every 10 seconds and when the tab is hidden. Use "Reset save" in the header to start over.

## Debug commands

The dev server adds a `mart` object to the browser console for playtesting. Production builds leave it out.

```js
mart.addMoney(1e6)   // add ₽ without counting it as earned
mart.openMarts(2)    // open the first 2 towns for free (no number: every playable town)
mart.away(3600)      // pretend you were away an hour (welcome back dialog)
mart.help()          // list the commands
```

## Stack

React 19, TypeScript, Vite, zustand, Tailwind CSS v4 and shadcn/ui on Base UI.

## Disclaimer

This is a personal fan project. It is not for distribution or sale.

It is not affiliated with, endorsed by or sponsored by Nintendo, Game Freak or The Pokémon Company. Pokémon and Pokémon character names are trademarks of Nintendo. Item sprites come from [PokeAPI](https://github.com/PokeAPI/sprites) and belong to their respective owners.
