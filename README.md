# PokéMart Clicker

An idle clicker game. You run the PokéMart in Pallet Town and grow it into a chain across Kanto, one town at a time.

Click the register to serve customers. Place daily orders so items sell on their own. Save up to open the next town's mart, which brings better items and a chain-wide sales bonus. Register upgrades make each click worth more, and achievements add a small permanent boost to all sales.

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
mart.openMarts(5)    // own the first 5 marts for free (no number: all 11)
mart.away(3600)      // pretend you were away an hour (welcome back dialog)
mart.help()          // list the commands
```

## Stack

React 19, TypeScript, Vite, zustand, Tailwind CSS v4 and shadcn/ui on Base UI.

## Disclaimer

This is a personal fan project. It is not for distribution or sale.

It is not affiliated with, endorsed by or sponsored by Nintendo, Game Freak or The Pokémon Company. Pokémon and Pokémon character names are trademarks of Nintendo. Item sprites come from [PokeAPI](https://github.com/PokeAPI/sprites) and belong to their respective owners.
