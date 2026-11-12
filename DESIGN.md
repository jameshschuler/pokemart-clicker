# PokéMart Clicker — Design

An idle/clicker game. You own the PokéMart in Pallet Town and grow it into a chain, town by town, then region by region (Kanto → Johto → Hoenn).

Personal project; not for distribution.

## Currency

Pokémon Dollars (₽). Start with ₽0.

## Core loop

1. Click the **register** to serve a customer (₽1 per click to start).
2. Spend ₽ stocking **items** on a mart's shelves — they sell automatically, forever (stock never depletes).
3. Spend ₽ on **upgrades** (one-time multipliers) and **staff**.
4. Save up to **open the next town's mart**. Your chain grows by one mart, with its own shelves and better items.
5. Catch **flash sales** for burst income.
6. Open the region's final town → earn the Master Ball → expand to the next region (prestige).

## Items

Each unit adds a fixed amount of sales/s. Unit cost grows 15% per purchase, counted **per mart**:

    cost(n) = baseCost × 1.15^n          (n = units of that item already in that mart)

So a new mart starts every item back at base price. That's the payoff for growing the chain: cheap shelves again, on top of the new items.

Item stock follows the real Poké Mart inventories from **FireRed/LeafGreen** (source: Serebii's Gen III Pokéarth pages). Status heals are separate items, sold where the games sell them. X Items (X Attack/Defend/Speed/Special/Accuracy, Dire Hit, Guard Spec.), Vitamins, TMs and Evolution Stones are grouped. Poké Doll, mail and the rooftop drinks are left out.

**Shelf capacity:** 100 units per item per mart. A full shelf can't be stocked further.

**Restock milestones:** when every item a mart sells reaches 10, 25, 50, then 100 units, that mart gives **+5% all sales** chain-wide per milestone (4 per mart, 44 in Kanto). This gives old marts a late-game purpose: maxing Pallet's 100 Potions costs about ₽117M, more than opening Indigo Plateau. Late marts can't reach 100 in Kanto; those milestones carry into later regions.

In-game prices (₽100–₽3,000) are too flat to drive an idle economy, so they aren't used. Costs below were tuned with a pacing simulation (greedy buyer, 3 clicks/s, stocks every shelf before moving on, milestones not targeted): each town's first new item costs about 45 seconds of income when the town opens, later new items in the same town 1.8× apart, in real-price order.

| Item | First sold in | Base cost | Sales/s |
|---|---|---|---|
| Potion | Pallet Town | 15 | 0.1 |
| Antidote | Viridian City | 65 | 0.4 |
| Poké Ball | Viridian City | 120 | 0.65 |
| Paralyze Heal | Viridian City | 210 | 1 |
| Awakening | Pewter City | 730 | 3.1 |
| Burn Heal | Pewter City | 1.3K | 4.9 |
| Repel | Pewter City | 2.4K | 7.2 |
| Escape Rope | Pewter City | 4.3K | 12 |
| Super Potion | Cerulean City | 4.8K | 16 |
| Ice Heal | Vermilion City | 27K | 65 |
| Super Repel | Lavender Town | 89K | 190 |
| Great Ball | Lavender Town | 160K | 310 |
| X Items | Celadon City | 350K | 600 |
| Revive | Celadon City | 630K | 960 |
| Evolution Stones | Celadon City | 1.1M | 1.3K |
| Full Heal | Fuchsia City | 1.6M | 2.2K |
| TMs | Celadon City | 2M | 1.7K |
| Max Repel | Fuchsia City | 2.8M | 3K |
| Vitamins | Celadon City | 3.6M | 2.5K |
| Hyper Potion | Saffron City | 4.7M | 4.6K |
| Ultra Ball | Fuchsia City | 5M | 3.9K |
| Max Potion | Indigo Plateau | 26M | 16K |
| Full Restore | Indigo Plateau | 48M | 26K |

## Towns (Kanto)

Pallet → Viridian → Pewter → Cerulean → Vermilion → Lavender → Celadon → Fuchsia → Saffron → Cinnabar → Indigo Plateau.

You build a **chain of PokéMarts**, one per town, opened in route order. Opening a town's mart costs a one-time lump sum and:

- adds a new mart with its own empty shelves;
- that mart stocks its town's new items **plus everything from earlier towns**, like the games (Pallet sells Potions; Viridian sells Potions and Poké Balls; Indigo Plateau sells all 14);
- gives a chain-wide bonus of **+5% all sales** per mart after Pallet (all 11 = +50%), on top of restock milestones.

The register is chain-wide: clicking serves a customer, no matter which mart you're viewing. Total ₽/s is the sum of every mart's shelves × the chain bonus.

Later systems count items **chain-wide** (total across all marts): item upgrades at 1/5/25/50/100 owned, tier synergies, Item Craze. Only pricing is per mart.

To open the next mart you need **all three**:

1. **Every shelf in your newest mart stocked** with at least one unit — like clearing a town before moving on.
2. **Chain sales** of at least the required ₽/s, so you can't rush marts on clicks alone.
3. **The lump sum** (about 2 minutes of income at that rate).

| Town | Stock (FRLG) | Needs ₽/s | Open cost | Sim time |
|---|---|---|---|---|
| Pallet Town | Potion (no mart in the games; this is your first) | — | — | 0 |
| Viridian City | Potion, Antidote, Poké Ball, Paralyze Heal ¹ | 1.5 | 180 | 4m |
| Pewter City | Potion, Poké Ball, Antidote, Paralyze Heal, Awakening, Burn Heal, Repel, Escape Rope | 16 | 1.9K | 11m |
| Cerulean City | Pewter's stock + Super Potion | 110 | 13K | 22m |
| Vermilion City | Poké Ball, Antidote, Paralyze Heal, Awakening, Repel, Super Potion, Ice Heal | 600 | 70K | 33m |
| Lavender Town | Antidote, Paralyze Heal, Burn Heal, Ice Heal, Escape Rope, Super Potion, Super Repel, Great Ball | 2K | 240K | 45m |
| Celadon City | Dept. Store: all five status heals, Super Potion, Super Repel, Great Ball, X Items, Revive, Evolution Stones, TMs, Vitamins | 7.7K | 920K | 58m |
| Fuchsia City | Super Potion, Great Ball, Revive, Full Heal, Max Repel, Ultra Ball | 34K | 4.1M | 77m |
| Saffron City | Escape Rope, Great Ball, Revive, Full Heal, Max Repel, Hyper Potion | 110K | 13M | 92m |
| Cinnabar Island | Escape Rope, Great Ball, Revive, Full Heal, Ultra Ball, Max Repel, Hyper Potion (nothing new) | 270K | 32M | 104m |
| Indigo Plateau | Great Ball, Revive, Full Heal, Ultra Ball, Max Repel, Max Potion, Full Restore | 590K | 71M | 118m |

¹ Serebii's FRLG page lists no Viridian mart. This stock is from memory of FRLG and is unverified.

## Staff

Bought like items (+15% cost per hire).

| Role | Unlock | Effect |
|---|---|---|
| Clerk | Pallet | Serves 1 customer / 10s at full click value |
| Stocker | Viridian | +2% item sales each |
| Delivery Driver | Pewter | ₽/s × marts owned; +2% offline earnings each (50% → 100%) |
| Promoter | Celadon | Flash sales spawn 3% more often each |

## Upgrades

One-time purchases.

- **Item upgrades** — ×2 an item at 1 / 5 / 25 / 50 / 100 owned.
- **Tier synergies** — every 25 of a higher tier ×2 the tier below (Great Ball → Poké Ball).
- **Town perks** (the marketing group) — one or two per town, themed on what the town is known for, unlocking when its mart opens. Effects vary on purpose so they don't all read as another "+%":

  | Town | Perk | Effect |
  |---|---|---|
  | Pallet Town | Prof. Oak's Recommendation | Potions ×2 |
  | Viridian City | Trainer School Field Trips | +₽1 per click per mart owned |
  | Pewter City | Museum Gift Shop | +10% all sales |
  | Cerulean City | Bike Shop Cross-Promo | Restock milestones give +7% instead of +5% |
  | Vermilion City | S.S. Anne Supply Contract | Poké, Great and Ultra Balls ×2 |
  | Lavender Town | Pokémon Tower Vigil Supplies | Escape Ropes and Repels ×2 |
  | Celadon City | Game Corner Prize Counter | Each click has a 1% chance to pay ×77 |
  | Fuchsia City | Safari Zone Kiosk | Offline cap 2h → 3h |
  | Saffron City | Silph Co. Partnership | +25% all sales |
  | Cinnabar Island | Lab Research Grant | Offline rate 50% → 75% (stacks with Delivery Drivers, capped at 100%) |
  | Indigo Plateau | Elite Four Sponsorship | +1% all sales per achievement tier, doubling the achievement bonus |

  Costs and exact values get tuned with the pacing sim when built.
- **Register** (built) — at least one per town, each unlocking when its town's mart opens. They follow how a real checkout modernizes (cash → electric → scanner → cards → tap → tablet → self checkout), with Pokémon working the counter where it fits:

  | Upgrade | Town | Cost | Effect |
  |---|---|---|---|
  | Second Till | Pallet Town | 100 | ×2 per click |
  | Meowth Coin Counter | Viridian City | 400 | ×2 per click |
  | Machop Bagger | Viridian City | 1K | ×2 per click |
  | Electric Till | Pewter City | 6K | ×2 per click |
  | Receipt Printer | Pewter City | 12K | +1% of chain ₽/s per click |
  | Barcode Scanner | Cerulean City | 30K | +1% |
  | Credit Card Machine | Vermilion City | 150K | +1% |
  | Express Lane | Lavender Town | 250K | +1% |
  | Loyalty Stamps | Lavender Town | 400K | +1% |
  | Conveyor Belt | Celadon City | 1.2M | +1% |
  | Department Store Counter | Celadon City | 2M | +1% |
  | Chansey Cashier | Fuchsia City | 8M | +1% |
  | Silph Card Reader | Saffron City | 15M | +1% |
  | Alakazam Price Check | Saffron City | 20M | +1% |
  | Machamp Bagger | Saffron City | 30M | +1% |
  | Porygon Tablet | Cinnabar Island | 45M | +1% |
  | Self Checkout | Indigo Plateau | 100M | +1% |

  Click value = ₽1 × 2^(doublings) + (sales share × chain ₽/s): up to ₽16 base and 13% of chain ₽/s per click. At 3 clicks/s with every upgrade, clicking adds about 39% on top of shelf income. The pacing sim finishes Kanto in ~108m with them vs ~118m without.

  Saved for later regions: phone pay as the step after Self Checkout (PokéGear pay in Johto, PokéNav pay in Hoenn), continuing the checkout tech line.
- **Supplier contracts** — ×2 an item family (Balls, Potions, Repels).

## Flash sales

A glowing price tag spawns every 1–3 min, lasts ~13s. Click to roll:

| Outcome | Odds | Effect |
|---|---|---|
| Flash Sale | 45% | All sales ×7 for 77s |
| Bulk Order | 40% | min(15% of bank, 15 min of sales) |
| Rush Hour | 10% | Clicks ×777 for 13s (clerks too) |
| Item Craze | 5% | One stocked item ×10 for 30s |

Effects stack.

## Regions (prestige)

Opening the last town unlocks **Expand to next region**: reset ₽, items, towns, staff, upgrades; keep **badges** (+10% earnings each, permanent). Each region's costs are ~1e3× the previous.

- **Johto** — trade routes between marts (Magnet Train links Goldenrod ↔ Saffron).
- **Hoenn** — weather demand shifts which items sell best.

## Mart scene

The game currently reads as lists of numbers. The mart scene gives it life and replaces the plain "Serve customer" box.

- **Storefront:** an original drawing of the selected town's PokéMart (blue roof, counter, shelves), tinted per town with a small landmark: Pewter rocks, Cerulean water, Vermilion's ship, Lavender's tower, and so on.
- **Staff:** register upgrades with Pokémon (Meowth, Machop, Chansey, Alakazam, Machamp, Porygon) stand behind the counter once bought. Staff hires from Iteration 4 join them.
- **Customers:** wild Pokémon from that town's nearby routes walk in (Pidgey and Rattata in Pallet, Geodude in Pewter, Gastly in Lavender). More ₽/s means more customers in the queue.
- **Shelves:** item sprites appear on the shelves as they're stocked, so a fuller mart looks fuller.
- **Clicking:** click the counter to serve the front customer. They walk out with a bag and the ₽ earned floats up.

Customers are Pokémon rather than trainers because PokeAPI has Pokémon sprites but no trainer sprites.

## Lifetime stats

Tracked from the first session and saved: time played, customers served (clicks), earned at the register, earned from shelves, total earned, total spent, items stocked, and the date of the first mart. Shown under the register. Pulled forward from iteration 7 because counts can't be backfilled.

## Achievements

Earned from game state and saved, so they survive later prestige resets. Each earned tier gives **+1% all sales** chain-wide, shown as its own line in the chain bonus. A toast pops up when one is earned. Some achievements have tiers earned in order; others are one-time. Hidden ones show "???" until earned.

Base set, one per category plus a second hidden one (16 tiers):

| Category | Achievement | Tiers |
|---|---|---|
| Register | Open for Business / Regular Rush / Queue Out the Door | Serve 100 / 1K / 10K customers |
| Earnings | Pocket Money / Millionaire / Silph Shareholder | Earn ₽1K / ₽1M / ₽100M in total |
| Chain | Small Chain / Regional Chain / Kanto Chain | Own 3 / 6 / 11 marts |
| Shelves | Restocked | Reach a restock milestone in any mart |
| Upgrades | Self-Service | Buy every register upgrade |
| Stocking | Stock Boy / Warehouse Run / Supply Chain | Stock 100 / 1K / 10K items |
| Hidden | Potion Hoarder | Fill Pallet Town with 100 Potions |
| Hidden | Premier Customer | Buy 10 Poké Balls at once (the games throw in a free Premier Ball) |

Later, with item upgrades: make the Premier Ball a real bonus item. Each purchase of 10+ Poké Balls adds a free Premier Ball to that shelf. It doesn't count toward the cap and sells a little.

More to come per category. Ideas: idle for 10 minutes without clicking, open Pewter in under 10 minutes.

## Art

Item icons and Pokémon (mart scene staff and customers) are PokeAPI sprites, hotlinked, for now. Grouped items use one member: X Attack, Protein, a Normal TM, Fire Stone. The game is personal and not distributed, and the footer carries a disclaimer.

PokeAPI has no town, building or trainer art, so the storefronts, town landmarks and route map are original inline SVG/CSS.

## Saving

localStorage autosave every 10s and on tab hide. Offline earnings at 50% (raised by drivers), capped at 8h. Export/import as a string.

## Layout

Three columns: **counter** (₽, chain sales/s, register, buffs) · **mart scene** (the selected mart's storefront, staff, customers, stocked shelves, flash sales) · **store** (the selected mart's items with its ₽/s, upgrades, Items/Staff tabs, open next town). Each item row has its own ×1 / ×10 / Max buttons showing their cost, and the shelf count is shown large. Click the balance to switch between short (₽1.04M) and full (₽1,040,123). Route map across the top: click an opened town to switch to that mart. Stacks on mobile.

## Iterations

Each one is playable.

1. **Register + first items** — click for ₽, buy Potion / Poké Ball, passive sales, buy ×1/×10/Max, autosave.
2. **Towns** — chain of marts, one per town, each with its own shelves and per-mart pricing; full Kanto item ladder; route map doubles as the mart switcher; open next town (needs ₽/s + lump sum); 100-unit shelf cap; restock milestones.
3. **Upgrades** — register upgrades and base achievements (done, with lifetime stats); next: town perks, item doublings, tier synergies.
4. **Staff** — Clerk, Stocker, Driver, Promoter.
5. **Flash sales** — spawning tag, four outcomes, buff bar.
6. **Mart scene** — storefront per town, staff and customer Pokémon, shelves filling up. Next up, pulled ahead of 3's remaining work, 4 and 5, because the game feels lifeless without it.
7. **Polish** — offline earnings, stats, export/import, balance pass.
8. **Prestige** — Master Ball, badges, region select.
9. **Johto** — trade routes.
10. **Hoenn** — weather.
