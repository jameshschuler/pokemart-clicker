# PokéMart Clicker — Design

An idle/clicker game. You own the PokéMart in Pallet Town and grow it into a chain, town by town, then region by region (Kanto → Johto → Hoenn).

Personal project; not for distribution.

## Currency

Pokémon Dollars (₽). Start with ₽0.

## Rework: the PokéMart franchise (draft)

**Status:** build step 1 done (the Flyer). See "What's in the code now" at the end of this section. Where later sections talk about buying items, daily orders or order milestones, that's the old model, kept for reference until each part is rebuilt.

**The idea.** You're building a **PokéMart franchise** across Kanto. You're the owner growing the brand, not the clerk behind one counter.

**Why.** Items used to be the thing you bought, and they earned money on their own. But an item is the product, not something that makes sales, so every label we tried (stock, displays, daily orders, clerks) felt wrong. In Cookie Clicker you never buy cookies; you buy grandmas and farms. Here you buy **producers**: the resources that run and grow the franchise. **Items** become upgrades that make every sale worth more.

### How money works

- A **sale** starts at ₽1. Numbers start small, like any idle game; real FireRed/LeafGreen prices are flavor, not money math. (A ₽300 Potion per click felt like too much, and nothing on screen counts items anymore, so the old "big money from a handful of items" mismatch can't come back.)
- **Producers** each add sales per second. Income = franchise sales per second × sale value × the franchise bonus.
- **Clicking the register** makes one sale yourself.
- Everything is **franchise-wide**: one producer list, one sale value. "180 Delivery Bikes" reads as a fleet across Kanto, not a crowded shop.

### Producers

Bought repeatedly, +15% cost each, counted across the whole franchise. **One at a time:** each is built and playtested before the next is designed. Planned ladder, cheap to expensive:

| # | Producer | How it adds sales |
|---|---|---|
| 1 | Flyer | Local marketing brings walk-ins |
| 2 | Delivery Bike | Brings orders to trainers on the routes |
| 3 | Vending Machine | Sells on its own, day and night |
| 4 | Stock Clerk | Keeps shelves full so nothing sells out (first employee) |
| 5 | Franchise Store | A new PokéMart run by a franchisee, paying you royalties |
| 6 | Delivery Truck | A regional supply fleet |
| 7 | Distribution Center | Keeps every store stocked |
| 8 | Department Store | A flagship, like Celadon |

**Flyer (producer 1):**

| | |
|---|---|
| What it does | 0.1 sales per second (one walk-in every 10 seconds) |
| Cost | ₽15 (15 sales), +15% each |
| At the start | ₽0.1/s each; the first flyer pays for itself in 150s |

### Items: franchise upgrades

- Each town's FRLG Poké Mart items are **one-time upgrades**. Buying one ("Stock Antidotes") makes every sale worth more, as a multiplier ("+10% sale value"), like Cookie Clicker's flavors.
- Pallet has no Poké Mart in FRLG; the franchise starts there selling Potions, the one invented catalog.
- Real prices can set the order and rough size of the bonus (a Full Restore boosts more than an Antidote). Exact values come from the pacing sim.

### Towns: where the franchise expands

Opening a town unlocks its items to stock, may unlock the next producer, and adds the franchise bonus (+5% per town). The route map shows how far the franchise reaches. Open costs and requirements get redesigned for the new model.

### Register upgrades (to redesign)

About checkout instead of abstract doublings:

- **Sales per click:** Second Till serves two customers at once; a Machop bagger speeds you up.
- **Upselling:** register customers spend more ("Want a Repel with that?").
- **Working the queue:** the old "+% of ₽/s per click" returns as serving people from the line, so clicking stays useful late.

### Build order

1. Swap the Clerk for the **Flyer**, make producers franchise-wide, hide the catalog. Saves reset. (Done.)
2. Viridian: opening the next town plus item upgrades (stock items to raise the sale value); the route map and catalog return.
3. Register upgrades on the new model.
4. The remaining towns, their items and the next producers.

### Step 2: Viridian (built)

The smallest slice that has both a new town and item upgrades. Later towns repeat the pattern.

**New items by town.** Every town but Cinnabar introduces items, unevenly: Pallet 1 (Potion, the starting item), Viridian 3, Pewter 4, Cerulean 1, Vermilion 1, Lavender 2, Celadon 27, Fuchsia 3, Saffron 1, Cinnabar 0, Indigo Plateau 2. Cinnabar gets a town perk instead. Celadon's 27 keep the floor tabs (2F, 4F, 5F, Roof) as the catalog.

**Opening Viridian**

| | |
|---|---|
| Cost | ₽1,000 |
| Needs | ₽5/s of income (about 5 Delivery Bikes) |
| Gives | +5% franchise bonus; Viridian's items to stock |

The route map comes back showing the franchise's reach (Pallet → Viridian, the rest locked), with an "Open Viridian" card under the register.

**Item upgrades.** Each new item is a one-time "Stock <item>" purchase that makes every sale worth more. The bonus scales with the item's FRLG price, +1% per ₽10, and adds up: sale value = ₽1 × (1 + total item bonus).

| Item | FRLG price | Bonus | Cost (placeholder) |
|---|---|---|---|
| Antidote | ₽100 | +10% | ₽1,500 |
| Poké Ball | ₽200 | +20% | ₽3,000 |
| Paralyze Heal | ₽200 | +20% | ₽4,500 |

The **Stock** list under the producers shows every open town's new items: stocked ones as "Stocked", the rest with their cost, plus the current ₽ per sale. Costs and the bonus formula get tuned with the pacing sim; +1% per ₽10 would make Celadon's vitamins +980% each, so the formula likely flattens for expensive items.

**Producers 2–4** (Cookie Clicker's early ladder shape, about ×7–12 cost per step):

| Producer | Cost | Sales/s | Unlocks |
|---|---|---|---|
| Flyer | ₽15 | 0.1 | Pallet |
| Delivery Bike | ₽100 | 1 | Pallet |
| Vending Machine | ₽1,100 | 8 | Pallet |
| Stock Clerk | ₽12,000 | 47 | Viridian |

**Later producers alternate employees and logistics, each tied to its town's real FRLG landmark.** Ideas: Cashier, Store Manager, Regional Manager, Machop Mover (Vermilion's ground-stomping Machop); Crossroads Warehouse (Viridian, where Routes 1, 2 and 22 meet), Underground Path Runner (Cerulean–Vermilion, Lavender–Celadon), S.S. Anne Freight (Vermilion), Cycling Road Courier (Celadon–Fuchsia), Silph Co. Supply Line (Saffron). The Pokémon Center Counter waits until every town has a Center to put one in.

A producer shows once its town is open. Only Pallet and Viridian can open for now; the route map shows the rest locked.

### What's in the code now (steps 1–2)

The register, four producers (Flyer, Delivery Bike, Vending Machine, Stock Clerk), opening Viridian, stocking Viridian's items, register upgrades, achievements, offline earnings and lifetime stats. Saves are version 4; stocked items merge into older version 4 saves as none.

- One franchise-wide producer list; each row has ×1 / ×10 / Max, how many you own and ₽/s each.
- The route map shows the franchise's reach; an "Open Viridian" card sits under the register.
- Achievements: Grand Opening / Papered the Town / Every Lamppost for 1 / 10 / 25 flyers, plus customers served, total earned, every register upgrade and Idle Hands. Town and other producer achievements come later.
- Register upgrades are shown numbered ("Register upgrade 1" to 17) with no names, at the table's costs, one at a time in order. They get redesigned in step 3.
- Only Pallet and Viridian can open (`PLAYABLE_TOWNS`). Item and town data for the rest (FRLG prices, stock, Celadon's floors) stay in the code for later steps.
- Removed: per-mart producers, buying items as producers, order milestones, Premier Customer, the order, Stocked and Chain achievements.

## Core loop

1. Click the **register** to serve a customer (₽1 per click to start).
2. Spend ₽ on **daily orders** of items for a mart. Each unit you add is one more of that item delivered and sold every day, automatically, forever.
3. Spend ₽ on **upgrades** (one-time multipliers) and **staff**.
4. Save up to **open the next town's mart**. Your chain grows by one mart, with its own orders and better items.
5. Catch **flash sales** for burst income.
6. Open the region's final town → earn the Master Ball → expand to the next region (prestige).

## Items

You buy **units per day**: a standing order with the supplier. "Super Potion · 120 a day" means 120 arrive and sell each day. Deliveries refill the shelves off-screen, so nothing runs out and the shop runs itself. This replaced shelves of stock, which never emptied and read as broken inventory.

Each unit a day adds a fixed amount of sales/s. Unit cost grows 15% per unit, counted **per mart** (each extra unit is harder to source):

    cost(n) = baseCost × 1.15^n          (n = units a day of that item already ordered in that mart)

So a new mart starts every item back at base price. That's the payoff for growing the chain: cheap orders again, on top of the new items.

Item stock follows the real Poké Mart inventories from **FireRed/LeafGreen** (source: Serebii's Gen III Pokéarth pages). Status heals are separate items, sold where the games sell them. Every item is ordered on its own, including each X item, vitamin, evolution stone and TM the Celadon Department Store sells. Poké Doll and mail are left out.

The Department Store items were once four grouped items (X Items, Vitamins, TMs, Evolution Stones). When split, each member is priced from its group's old cost and rate, scaled by its in-game price relative to the group's average and divided by √(group size). Dividing by the full group size made them cheaper than Lavender's items; √ keeps them above most of Lavender and leaves the pacing sim unchanged (~108m). The rooftop drinks use the same scale as the X items (about ₽228 per in-game ₽).

**No cap.** An order can always grow; the 15% cost curve is the only limit.

**Order milestones:** when every item a mart sells reaches 10, 25, 50, then 100 a day, that mart gives **+5% all sales** chain-wide per milestone (4 per mart, 44 in Kanto). This gives old marts a late-game purpose: ordering 100 Potions a day in Pallet costs about ₽117M, more than opening Indigo Plateau. Late marts can't reach 100 in Kanto; those milestones carry into later regions.

In-game prices (₽100–₽3,000) are too flat to drive an idle economy, so they aren't used. Costs below were tuned with a pacing simulation (greedy buyer, 3 clicks/s, orders every item before moving on, milestones not targeted): each town's first new item costs about 45 seconds of income when the town opens, later new items in the same town 1.8× apart, in real-price order.

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
| Fresh Water | Celadon City | 46K | 78 |
| Soda Pop | Celadon City | 68K | 120 |
| Lemonade | Celadon City | 80K | 140 |
| X Speed | Celadon City | 80K | 140 |
| X Special | Celadon City | 80K | 140 |
| Super Repel | Lavender Town | 89K | 190 |
| X Attack | Celadon City | 110K | 200 |
| X Defend | Celadon City | 130K | 220 |
| Dire Hit | Celadon City | 150K | 250 |
| Great Ball | Lavender Town | 160K | 310 |
| Guard Spec. | Celadon City | 160K | 270 |
| X Accuracy | Celadon City | 220K | 370 |
| TM05 Roar | Celadon City | 250K | 210 |
| TM28 Dig | Celadon City | 500K | 430 |
| Fire Stone | Celadon City | 550K | 650 |
| Thunder Stone | Celadon City | 550K | 650 |
| Water Stone | Celadon City | 550K | 650 |
| Leaf Stone | Celadon City | 550K | 650 |
| Revive | Celadon City | 630K | 960 |
| TM31 Brick Break | Celadon City | 750K | 640 |
| TM43 Secret Power | Celadon City | 750K | 640 |
| TM45 Attract | Celadon City | 750K | 640 |
| HP Up | Celadon City | 1.5M | 1K |
| Protein | Celadon City | 1.5M | 1K |
| Iron | Celadon City | 1.5M | 1K |
| Calcium | Celadon City | 1.5M | 1K |
| Zinc | Celadon City | 1.5M | 1K |
| Carbos | Celadon City | 1.5M | 1K |
| Full Heal | Fuchsia City | 1.6M | 2.2K |
| TM15 Hyper Beam | Celadon City | 1.9M | 1.6K |
| Max Repel | Fuchsia City | 2.8M | 3K |
| Hyper Potion | Saffron City | 4.7M | 4.6K |
| Ultra Ball | Fuchsia City | 5M | 3.9K |
| Max Potion | Indigo Plateau | 26M | 16K |
| Full Restore | Indigo Plateau | 48M | 26K |

## Towns (Kanto)

Pallet → Viridian → Pewter → Cerulean → Vermilion → Lavender → Celadon → Fuchsia → Saffron → Cinnabar → Indigo Plateau.

You build a **chain of PokéMarts**, one per town, opened in route order. Opening a town's mart costs a one-time lump sum and:

- adds a new mart with no orders yet;
- that mart stocks what its FireRed/LeafGreen mart sells, so items can drop out along the route (Lavender sells Great Balls but no Poké Balls or Potions). Earlier marts keep selling them, since you own the whole chain. **Celadon's Department Store** is the exception: it sells every item any earlier mart sells, plus its own;
- gives a chain-wide bonus of **+5% all sales** per mart after Pallet (all 11 = +50%), on top of order milestones.

The register is chain-wide: clicking serves a customer, no matter which mart you're viewing. Total ₽/s is the sum of every mart's orders × the chain bonus.

Later systems count items **chain-wide** (total across all marts): item upgrades at 1/5/25/50/100 owned, tier synergies, Item Craze. Only pricing is per mart.

To open the next mart you need **all three**:

1. **Every item in your newest mart ordered**, at least one a day — like clearing a town before moving on.
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
| Celadon City | Dept. Store: every item from earlier marts (Potion, Poké Ball, Repel, Escape Rope, all five status heals, Super Potion, Super Repel, Great Ball) plus Revive, 6 TMs, 4 evolution stones, 7 X items and battle items, 6 vitamins, 3 rooftop drinks (39 items) ² | 7.7K | 920K | 58m |
| Fuchsia City | Super Potion, Great Ball, Revive, Full Heal, Max Repel, Ultra Ball | 34K | 4.1M | 77m |
| Saffron City | Escape Rope, Great Ball, Revive, Full Heal, Max Repel, Hyper Potion | 110K | 13M | 92m |
| Cinnabar Island | Escape Rope, Great Ball, Revive, Full Heal, Ultra Ball, Max Repel, Hyper Potion (nothing new) | 270K | 32M | 104m |
| Indigo Plateau | Great Ball, Revive, Full Heal, Ultra Ball, Max Repel, Max Potion, Full Restore | 590K | 71M | 118m |

¹ Serebii's FRLG page lists no Viridian mart. This stock is from memory of FRLG and is unverified.

² The store is named "Celadon City Department Store" and its items are grouped by floor, like the game: 2F Trainer's Market (Balls, medicine, Repels, Escape Rope, Revive, six TMs), 4F Wise Man Gifts (four evolution stones), 5F Drugstore (X items, Guard Spec., Dire Hit, six vitamins), and the Roof's vending machines (Fresh Water, Soda Pop, Lemonade). Floors are tabs in the store, each showing how many of its items aren't ordered yet. The FRLG Department Store doesn't sell Potions, Poké Balls, Repels or Escape Ropes. They're added to 2F so the biggest store in Kanto carries everything. This adds 4 cheap items and doesn't change the pacing sim (Kanto in ~108m either way).

## Staff

Bought like items (+15% cost per hire).

| Role | Unlock | Effect |
|---|---|---|
| Clerk | Pallet | Serves 1 customer / 10s at full click value |
| Stocker | Viridian | +2% item sales each |
| Delivery Driver | Pewter | ₽/s × marts owned |
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
  | Cerulean City | Bike Shop Cross-Promo | Order milestones give +7% instead of +5% |
  | Vermilion City | S.S. Anne Supply Contract | Poké, Great and Ultra Balls ×2 |
  | Lavender Town | Pokémon Tower Vigil Supplies | Escape Ropes and Repels ×2 |
  | Celadon City | Game Corner Prize Counter | Each click has a 1% chance to pay ×77 |
  | Fuchsia City | Safari Zone Kiosk | Offline cap 2h → 3h |
  | Saffron City | Silph Co. Partnership | +25% all sales |
  | Cinnabar Island | Lab Research Grant | Offline cap 3h → 4h |
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

  Click value = ₽1 × 2^(doublings) + (sales share × chain ₽/s): up to ₽16 base and 13% of chain ₽/s per click. At 3 clicks/s with every upgrade, clicking adds about 39% on top of order income. The pacing sim finishes Kanto in ~108m with them vs ~118m without.

  Saved for later regions: phone pay as the step after Self Checkout (PokéGear pay in Johto, PokéNav pay in Hoenn), continuing the checkout tech line.
- **Supplier contracts** — ×2 an item family (Balls, Potions, Repels).
- **Growing the business** (ideas, unbuilt) — daily orders open upgrades about the supply side, not just multipliers:
  - Bulk discounts: an item's orders past 50 a day cost less per unit.
  - Warehouse: one per town, makes that mart's orders cheaper.
  - Delivery route: extra deliveries a day, ×2 an item's units.
  - Exclusive supplier: a town's signature item (Cerulean's Super Potions, Lavender's Escape Ropes) sells for more there.

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
- **Shelves:** item sprites fill the shelves as orders grow, so a busier mart looks fuller. Purely visual; deliveries keep them topped up.
- **Clicking:** click the counter to serve the front customer. They walk out with a bag and the ₽ earned floats up.

Customers are Pokémon rather than trainers because PokeAPI has Pokémon sprites but no trainer sprites.

## Lifetime stats

Tracked from the first session and saved: time played, customers served (clicks), earned at the register, earned from sales, total earned, total spent, units ordered a day, and the date of the first mart. Shown under the register. Pulled forward from iteration 7 because counts can't be backfilled.

## Achievements

Earned from game state and saved, so they survive later prestige resets. Each earned tier gives **+1% all sales** chain-wide, shown as its own line in the chain bonus. A toast pops up when one is earned. Some achievements have tiers earned in order; others are one-time. Hidden ones show "???" until earned.

Base set (28 tiers):

| Category | Achievement | Tiers |
|---|---|---|
| Register | Open for Business / Regular Rush / Queue Out the Door | Serve 100 / 1K / 10K customers |
| Earnings | Pocket Money / Millionaire / Silph Shareholder | Earn ₽1K / ₽1M / ₽100M in total |
| Chain | Small Chain / Regional Chain / Kanto Chain | Own 3 / 6 / 11 marts |
| Milestones | Steady Supply | Reach an order milestone in any mart |
| Milestones | Pallet Town Stocked … Indigo Plateau Stocked (11) | Order 25 a day of every item in that town's mart |
| Milestones | Kanto Stocked | Order 25 a day of every item in all 11 Kanto marts |
| Upgrades | Self-Service | Buy every register upgrade |
| Orders | Stock Boy / Warehouse Run / Supply Chain | Order 100 / 1K / 10K units a day in total |
| Hidden | Idle Hands | Earn ₽1M while away |
| Hidden | Premier Customer | Buy 10 Poké Balls at once (the games throw in a free Premier Ball) |

Later, with item upgrades: make the Premier Ball a real bonus item. Each purchase of 10+ Poké Balls adds a free Premier Ball to that mart's daily delivery. It sells a little.

Stocked towns also show a check in their dot on the route map. "Stocked" means 25 a day of every item. Each unit costs 15% more than the last, so 100 a day of everything in a late mart takes years even at end-of-Kanto income (Indigo Plateau about 35). At 25, early towns take seconds and Indigo Plateau about 8 hours, so stocking all of Kanto is a real late-game goal.

More to come per category. Ideas: open Pewter in under 10 minutes.

## Art

Item icons and Pokémon (mart scene staff and customers) are PokeAPI sprites, hotlinked, for now. TMs share their move type's disc sprite. The game is personal and not distributed, and the footer carries a disclaimer.

PokeAPI has no town, building or trainer art, so the storefronts, town landmarks and route map are original inline SVG/CSS.

## Saving

localStorage autosave every 10s and on tab hide. Export/import as a string.

**Offline earnings** (built): time away pays sales in full, capped at 2h. There's no rate penalty: an idle game shouldn't punish you for not watching it. Clicks don't count. Kanto takes about 2h to clear, so the cap stops one night away from paying for most of the region. Raise it with each region as runs get longer (Fuchsia and Cinnabar perks add an hour each). The game saves the wall-clock time it has paid sales up to. Any gap since then (a closed tab, a hidden tab the browser paused, a sleeping laptop) is paid on return. Gaps of 15 minutes or more count as time away: a "Welcome back" dialog shows the time and ₽ earned, and lifetime stats track "Earned while away". Shorter gaps count as play time.

## Layout

Three columns: **counter** (₽, chain sales/s, register, buffs) · **mart scene** (the selected mart's storefront, staff, customers, stocked shelves, flash sales) · **store** (the selected mart's items with its ₽/s, upgrades, Items/Staff tabs, open next town). Each item row has its own ×1 / ×10 / Max buttons showing their cost, and the units a day are shown large. Click the balance to switch between short (₽1.04M) and full (₽1,040,123). Route map across the top: click an opened town to switch to that mart. Stacks on mobile.

## Iterations

Each one is playable.

1. **Register + first items** — click for ₽, buy Potion / Poké Ball, passive sales, buy ×1/×10/Max, autosave.
2. **Towns** — chain of marts, one per town, each with its own orders and per-mart pricing; full Kanto item ladder; route map doubles as the mart switcher; open next town (needs ₽/s + lump sum); order milestones. (Built with a 100-unit shelf cap, later replaced by uncapped daily orders.)
3. **Upgrades** — register upgrades and base achievements (done, with lifetime stats); next: town perks, item doublings, tier synergies.
4. **Staff** — Clerk, Stocker, Driver, Promoter.
5. **Flash sales** — spawning tag, four outcomes, buff bar.
6. **Mart scene** — storefront per town, staff and customer Pokémon, shelves filling up. Next up, pulled ahead of 3's remaining work, 4 and 5, because the game feels lifeless without it.
7. **Polish** — export/import, balance pass. (Offline earnings and stats pulled forward.)
8. **Prestige** — Master Ball, badges, region select.
9. **Johto** — trade routes.
10. **Hoenn** — weather.
