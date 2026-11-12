# PokéMart Clicker

Cookie Clicker–style idle game: you own the PokéMart in Pallet Town and expand town by town, then region by region (Kanto → Johto → Hoenn). Personal project, not for distribution.

**[DESIGN.md](DESIGN.md) is the source of truth for game design** — items, towns, staff, upgrades, flash sales, prestige, and the iteration plan. Update it when a design decision changes.

## How we work

- **Small, playable iterations.** Build one iteration from DESIGN.md at a time, then stop so the user can playtest before starting the next. Don't bundle iterations.
- After each iteration: run tests, build and lint, start the dev server, and list what to try and what feedback would be useful.
- Real Pokémon region, town and item names are used. Item icons are PokeAPI sprites for now, hotlinked, with a disclaimer in the footer. This is fine only because the game is personal and never distributed. Other art is original inline SVG/CSS.

## Status

- [x] Iteration 1 — register click, Potion + Poké Ball, passive sales, buy ×1/×10/Max, autosave
- [x] Iteration 2 — towns: full Kanto item ladder gated by towns, route map, open next town
- [ ] Iteration 3 — upgrades: register upgrades, lifetime stats and base achievements done; town perks, item doublings, tier synergies to go
- [ ] Next: Iteration 6 — mart scene, pulled forward
- [ ] 4 staff · 5 flash sales · 7 polish · 8 prestige · 9 Johto · 10 Hoenn

Open design questions: retro handheld look vs. clean dashboard (currently default shadcn theme); pacing target (~2h to clear Kanto, unconfirmed).

## Commands

- `npm run dev` — Vite dev server
- `npm test` — Vitest (economy math)
- `npm run build` — typecheck + build
- Dev console: `mart.addMoney(1e6)`, `mart.openMarts(5)`, `mart.skip(3600)`, `mart.help()` (dev builds only)
- `npm run lint` — oxlint (the two `only-export-components` warnings in `components/ui/` are expected)

## Code layout

- `src/game/` — game logic, no React except `useGameLoop.ts`
  - `items.ts` item data · `towns.ts` Kanto route, stock and open costs · `upgrades.ts` register upgrades · `stats.ts` lifetime stats · `achievements.ts` achievements · `economy.ts` pure math (costs, sales/s, click value) · `format.ts` number formatting
  - `store.ts` zustand store (state + actions) · `save.ts` localStorage save/load/autosave · `useGameLoop.ts` rAF loop
- `src/components/` — UI, organized by feature folder; `components/ui/` are shadcn primitives (base-nova style, Base UI)
- `src/hooks/` — React hooks other than the game loop
- `src/lib/` — non-game helpers (`utils.ts` holds `cn`)

## Game conventions

- Keep economy math pure and covered in `economy.test.ts`; components read derived values via selectors.
- Select narrowly from the store (`useShallow` for objects) — the loop updates `coins` every frame.
- Shared game state and actions live in the zustand store, not React context or props passed down several levels.
- Bump `SAVE_VERSION` in `save.ts` only for breaking save changes; new fields should merge in with defaults instead.
- The shadcn CLI once rewrote `cn` imports to an npm package named `cn`. After `shadcn add`, check imports use `@/lib/utils`.

## Coding style

- Write concise, production-ready TypeScript and React.
- **Zero comments** unless logic is genuinely non-obvious or complex.
- Keep components and functions modular and minimal.
- Always use braces for `if` statements, even single-line bodies. Write `if (existing) { return existing; }` on separate lines, never `if (existing) return existing;`.
- **Blank line before `return`**, unless it's the first statement in its block.
- **Group logic with blank lines.** Inside a function, leave a blank line after a run of declarations and after each block (`if`, `for`, `switch`, …), so each step reads as its own paragraph. Consecutive `const`s that belong together stay together.
- **Avoid nested loops.** Don't search a list inside a loop (`.includes`, `.indexOf`, `.find`, `.some` on an array): build a `Set` or `Map` once and look up in it. When loops nest more than two deep, pull the inner work into a named function. Walking nested data and comparing items in pairs are fine.
- **No single-letter names.** `(item) => item.cost`, not `(i) => i.cost`; `for (let index = 0; …)`; sort comparators take `(left, right)` or domain names like `(cheaper, pricier)`. A lone `_` for an unused parameter is fine.
- **Don't nest `await`.** Give each awaited value its own `const` before using it. No `(await x).field`, `await (await fetch(url)).json()` or `await x` as an argument. In tests, use `await expect(promise).resolves…` instead of `expect(await promise)`. A single `await` that's assigned, returned or cast is fine.

## Quality & simplicity

- **Production quality.** Clear names, small focused units, explicit types. Handle real failures where they happen (a corrupt save, invalid input), and nothing more. No dead code, debug logging, TODOs or commented-out code.
- **KISS and YAGNI.** Choose the simplest solution that fully solves the problem. Prefer plain functions and data over classes, abstractions, generics or configuration until a second real use case demands them. No speculative features, options or extension points.
- **Not verbose.** Avoid redundant variables, wrappers that only forward arguments, defensive checks for states that can't occur, and restating types the compiler infers. Clarity beats cleverness — don't golf.
- **Pragmatic, not enterprise.** No defensive null-checks or heavy error boundaries unless asked.
- **Maintainable by default.** Short single-purpose functions, early returns over deep nesting, side effects at the edges, loosely coupled modules so a change touches one place.
- **Follow existing patterns.** Match the conventions, libraries and structure already here. Add a dependency only when it clearly beats a few lines of code.

## Strategic design

- **Think long term.** Each change should leave the design as good or better than before. Spend a little extra time on the design now instead of paying for shortcuts later.
- **Fix the design, don't work around it.** When a change doesn't fit the current structure, reshape the structure instead of bolting on a special case, flag or duplicate path. If the cleanup is large or unrelated, raise it and do it as a separate change.
- **Deep modules, simple interfaces.** Hide real complexity behind a small, obvious API. Avoid shallow layers that just pass calls through.
- **Keep game rules out of components.** Economy, unlocks and pricing live in `src/game/` so they can change without touching UI.
- **Name things after the game.** Use the words DESIGN.md uses (town, item, staff, flash sale, prestige), one name per concept everywhere.
- **Make trade-offs visible.** When you knowingly take a shortcut, say what it costs and when to revisit it.
- **Strategic isn't speculative.** Design for the change you can see coming (the next iterations in DESIGN.md), not every change you can imagine.

## Testing

- **Every change ships with tests.** New game logic gets unit tests; bug fixes get a regression test that fails before the fix.
- **Test behavior, not implementation.** Assert on inputs, outputs and user-visible behavior. Mock only external boundaries (localStorage, time).
- **Cover the edges.** Empty, boundary, invalid and error cases, not just the happy path (zero coins, max-buy with exactly enough, a save from an older version).
- **Keep tests simple and fast.** One behavior per test, descriptive names, minimal setup, no shared mutable state, deterministic results. Prefer table-driven tests (`it.each`) for many similar cases.
- Run the relevant tests and confirm they pass before considering work done.

## Components

- **One component per file.** Each `.tsx` file in `src/components/` exports exactly one component, named after the file (`ItemRow.tsx` exports `ItemRow`). Sub-components get their own file. `src/components/ui/` is the exception: leave shadcn compound exports together so they can be regenerated.
- **Keep components under 150 lines.** Past that, split out sub-components, move logic into a hook in `src/hooks/`, or move game logic into `src/game/`. Doesn't apply to `ui/`.
- **Organize by feature.** Put components in a folder named for the feature (e.g. `register/`, `shop/`, `map/`, `layout/`). Shared components go in a clearly named shared folder, never at the root of `src/components/`. App-specific components never go in `ui/`.
- **Feature-only constants sit next to the feature** as a `.ts` file (e.g. `shop/shop-styles.ts`).
- **Pure helpers don't live in components.** Formatting, math and grouping go in `src/game/` (game logic) or `src/lib/` (everything else), with unit tests. Only define a function inside a component when it closes over that component's state or props.
- **Never duplicate a helper or constant.** Search `src/game/` and `src/lib/` first and reuse or extend. No magic numbers inline.
- **Pass values, not formatters.** Helpers take what they need as arguments; don't pass formatting functions down as props.
- **Props are fine for small presentational components** whose inputs genuinely vary per use. Keep them to a handful.

## Writing docs and prose

- Write like a person wrote it for this context, not like a template or an AI. Keep the original meaning.
- Clear, specific, factual language over generic, inflated or promotional wording.
- Direct, plain phrasing. Cut filler such as "in order to".
- No excessive hedging or templated structure: predictable intros, recap summaries, "challenges" or "future outlook" sections.
- Vary sentence length and rhythm. Go easy on em dashes.
- No assistant artifacts: sign-offs, disclaimers, or mentions of being an AI.

## Git & GitHub

Remote: `github.com/jameshschuler/pokemart-clicker`.

- **Wait for my review before committing.** Finish the change, run the checks and tell me what changed. Don't commit, push or open a pull request until I say go. This includes small follow-ups on an open pull request.
- **Never push to `main`.** All changes land via pull request.
- **Never create a repo, fork, or push outside `jameshschuler`** without confirming with me first. Ask before any `gh repo create`.
- **Branches:** `feature/short-description`, `bugfix/short-description`, `hotfix/short-description`.
- **Checks before committing:** `npm run lint`, `npm test` and `npm run build` (which also typechecks). Fix anything that fails, then run `/code-review` on the pending changes. Fix confirmed findings (or tell me about the ones you're leaving), and rerun the checks if anything changed.
- **Commit messages:** prefix with `feat:`, `fix:`, `improvement:`, `docs:`, `refactor:`, `ci:`, `chore:` or `revert:`, then a short description. Keep each commit focused.
- **Pull requests:** a short `## Summary` (what changed and why) and `## Testing` (what you ran and how you checked it). Keep the Claude Code attribution trailers.
