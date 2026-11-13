export type ItemId =
  | 'potion'
  | 'antidote'
  | 'pokeBall'
  | 'paralyzeHeal'
  | 'awakening'
  | 'burnHeal'
  | 'repel'
  | 'escapeRope'
  | 'superPotion'
  | 'iceHeal'
  | 'freshWater'
  | 'sodaPop'
  | 'lemonade'
  | 'xSpeed'
  | 'xSpecial'
  | 'superRepel'
  | 'xAttack'
  | 'xDefend'
  | 'direHit'
  | 'greatBall'
  | 'guardSpec'
  | 'xAccuracy'
  | 'tmRoar'
  | 'tmDig'
  | 'fireStone'
  | 'thunderStone'
  | 'waterStone'
  | 'leafStone'
  | 'revive'
  | 'tmBrickBreak'
  | 'tmSecretPower'
  | 'tmAttract'
  | 'hpUp'
  | 'protein'
  | 'iron'
  | 'calcium'
  | 'zinc'
  | 'carbos'
  | 'fullHeal'
  | 'tmHyperBeam'
  | 'maxRepel'
  | 'hyperPotion'
  | 'ultraBall'
  | 'maxPotion'
  | 'fullRestore'

export interface Item {
  id: ItemId
  name: string
  description: string
  baseCost: number
  salesPerSecond: number
  /** PokeAPI sprite name. TMs share their move type's sprite. */
  sprite: string
}

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items'

export function itemSpriteUrl(item: Item): string {
  return `${SPRITE_BASE}/${item.sprite}.png`
}

export const ITEMS: Item[] = [
  {
    id: 'potion',
    name: 'Potion',
    description: 'Restores 20 HP. Every trainer leaving Pallet needs a few.',
    baseCost: 15,
    salesPerSecond: 0.1,
    sprite: 'potion',
  },
  {
    id: 'antidote',
    name: 'Antidote',
    description: 'Cures poison. Viridian Forest is crawling with Weedle.',
    baseCost: 65,
    salesPerSecond: 0.4,
    sprite: 'antidote',
  },
  {
    id: 'pokeBall',
    name: 'Poké Ball',
    description: 'The classic. Rookies buy them by the dozen.',
    baseCost: 120,
    salesPerSecond: 0.65,
    sprite: 'poke-ball',
  },
  {
    id: 'paralyzeHeal',
    name: 'Paralyze Heal',
    description: 'Cures paralysis. Pikachu fans buy these in bulk.',
    baseCost: 210,
    salesPerSecond: 1,
    sprite: 'paralyze-heal',
  },
  {
    id: 'awakening',
    name: 'Awakening',
    description: 'Wakes a sleeping Pokémon. Jigglypuff is a menace.',
    baseCost: 730,
    salesPerSecond: 3.1,
    sprite: 'awakening',
  },
  {
    id: 'burnHeal',
    name: 'Burn Heal',
    description: 'Cures a burn. Popular with anyone training near Charmander.',
    baseCost: 1_300,
    salesPerSecond: 4.9,
    sprite: 'burn-heal',
  },
  {
    id: 'repel',
    name: 'Repel',
    description: 'Keeps the Zubat away in Mt. Moon. Mostly.',
    baseCost: 2_400,
    salesPerSecond: 7.2,
    sprite: 'repel',
  },
  {
    id: 'escapeRope',
    name: 'Escape Rope',
    description: 'For anyone lost in a cave. Which is everyone.',
    baseCost: 4_300,
    salesPerSecond: 12,
    sprite: 'escape-rope',
  },
  {
    id: 'superPotion',
    name: 'Super Potion',
    description: 'Restores 50 HP. Gym challengers stock up before Misty.',
    baseCost: 4_800,
    salesPerSecond: 16,
    sprite: 'super-potion',
  },
  {
    id: 'iceHeal',
    name: 'Ice Heal',
    description: 'Thaws a frozen Pokémon. Seafoam Islands regulars keep a few.',
    baseCost: 27_000,
    salesPerSecond: 65,
    sprite: 'ice-heal',
  },
  {
    id: 'freshWater',
    name: 'Fresh Water',
    description: 'Restores 50 HP. The rooftop vending machine sells out on hot days.',
    baseCost: 46_000,
    salesPerSecond: 78,
    sprite: 'fresh-water',
  },
  {
    id: 'sodaPop',
    name: 'Soda Pop',
    description: 'Restores 60 HP. Fizzy, and the machine sometimes drops a second can.',
    baseCost: 68_000,
    salesPerSecond: 120,
    sprite: 'soda-pop',
  },
  {
    id: 'lemonade',
    name: 'Lemonade',
    description: 'Restores 80 HP. The priciest drink on the roof, and the one to trade a guard.',
    baseCost: 80_000,
    salesPerSecond: 140,
    sprite: 'lemonade',
  },
  {
    id: 'xSpeed',
    name: 'X Speed',
    description: 'Raises Speed for one battle. Outrun anything for a few turns.',
    baseCost: 80_000,
    salesPerSecond: 140,
    sprite: 'x-speed',
  },
  {
    id: 'xSpecial',
    name: 'X Special',
    description: 'Raises Special for one battle. Psychic types love it.',
    baseCost: 80_000,
    salesPerSecond: 140,
    sprite: 'x-sp-atk',
  },
  {
    id: 'superRepel',
    name: 'Super Repel',
    description: 'Lasts longer. Rock Tunnel is dark and very long.',
    baseCost: 89_000,
    salesPerSecond: 190,
    sprite: 'super-repel',
  },
  {
    id: 'xAttack',
    name: 'X Attack',
    description: 'Raises Attack for one battle. Trainers buy them by the handful before a Gym.',
    baseCost: 110_000,
    salesPerSecond: 200,
    sprite: 'x-attack',
  },
  {
    id: 'xDefend',
    name: 'X Defend',
    description: 'Raises Defense for one battle. Popular before Brock and his Onix.',
    baseCost: 130_000,
    salesPerSecond: 220,
    sprite: 'x-defense',
  },
  {
    id: 'direHit',
    name: 'Dire Hit',
    description: 'Raises the critical-hit ratio for one battle.',
    baseCost: 150_000,
    salesPerSecond: 250,
    sprite: 'dire-hit',
  },
  {
    id: 'greatBall',
    name: 'Great Ball',
    description: 'Better catch rate. Worth it once the wild Pokémon get tougher.',
    baseCost: 160_000,
    salesPerSecond: 310,
    sprite: 'great-ball',
  },
  {
    id: 'guardSpec',
    name: 'Guard Spec.',
    description: 'Stops stat drops for five turns. Mist in a bottle.',
    baseCost: 160_000,
    salesPerSecond: 270,
    sprite: 'guard-spec',
  },
  {
    id: 'xAccuracy',
    name: 'X Accuracy',
    description: 'Raises accuracy for one battle. Pair it with a one-hit move and pray.',
    baseCost: 220_000,
    salesPerSecond: 370,
    sprite: 'x-accuracy',
  },
  {
    id: 'tmRoar',
    name: 'TM05 Roar',
    description: 'Scares off wild Pokémon. Cheapest TM on the counter.',
    baseCost: 250_000,
    salesPerSecond: 210,
    sprite: 'tm-normal',
  },
  {
    id: 'tmDig',
    name: 'TM28 Dig',
    description: 'Burrow underground, then strike. Also gets you out of caves.',
    baseCost: 500_000,
    salesPerSecond: 430,
    sprite: 'tm-ground',
  },
  {
    id: 'fireStone',
    name: 'Fire Stone',
    description: 'Evolves Vulpix, Growlithe and Eevee. Warm to the touch.',
    baseCost: 550_000,
    salesPerSecond: 650,
    sprite: 'fire-stone',
  },
  {
    id: 'thunderStone',
    name: 'Thunder Stone',
    description: 'Evolves Pikachu and Eevee. Crackles on the shelf.',
    baseCost: 550_000,
    salesPerSecond: 650,
    sprite: 'thunder-stone',
  },
  {
    id: 'waterStone',
    name: 'Water Stone',
    description: 'Evolves Shellder, Staryu, Poliwhirl and Eevee.',
    baseCost: 550_000,
    salesPerSecond: 650,
    sprite: 'water-stone',
  },
  {
    id: 'leafStone',
    name: 'Leaf Stone',
    description: 'Evolves Gloom, Weepinbell and Exeggcute.',
    baseCost: 550_000,
    salesPerSecond: 650,
    sprite: 'leaf-stone',
  },
  {
    id: 'revive',
    name: 'Revive',
    description: 'Brings a fainted Pokémon back. Always the first thing to sell out.',
    baseCost: 630_000,
    salesPerSecond: 960,
    sprite: 'revive',
  },
  {
    id: 'tmBrickBreak',
    name: 'TM31 Brick Break',
    description: 'Smashes through Reflect and Light Screen.',
    baseCost: 750_000,
    salesPerSecond: 640,
    sprite: 'tm-fighting',
  },
  {
    id: 'tmSecretPower',
    name: 'TM43 Secret Power',
    description: 'Its side effect changes with where you battle.',
    baseCost: 750_000,
    salesPerSecond: 640,
    sprite: 'tm-normal',
  },
  {
    id: 'tmAttract',
    name: 'TM45 Attract',
    description: 'Infatuates foes of the opposite gender.',
    baseCost: 750_000,
    salesPerSecond: 640,
    sprite: 'tm-normal',
  },
  {
    id: 'hpUp',
    name: 'HP Up',
    description: 'Raises base HP. Pricey, and serious trainers buy them by the box.',
    baseCost: 1.5e6,
    salesPerSecond: 1_000,
    sprite: 'hp-up',
  },
  {
    id: 'protein',
    name: 'Protein',
    description: 'Raises base Attack.',
    baseCost: 1.5e6,
    salesPerSecond: 1_000,
    sprite: 'protein',
  },
  {
    id: 'iron',
    name: 'Iron',
    description: 'Raises base Defense.',
    baseCost: 1.5e6,
    salesPerSecond: 1_000,
    sprite: 'iron',
  },
  {
    id: 'calcium',
    name: 'Calcium',
    description: 'Raises base Special Attack.',
    baseCost: 1.5e6,
    salesPerSecond: 1_000,
    sprite: 'calcium',
  },
  {
    id: 'zinc',
    name: 'Zinc',
    description: 'Raises base Special Defense.',
    baseCost: 1.5e6,
    salesPerSecond: 1_000,
    sprite: 'zinc',
  },
  {
    id: 'carbos',
    name: 'Carbos',
    description: 'Raises base Speed.',
    baseCost: 1.5e6,
    salesPerSecond: 1_000,
    sprite: 'carbos',
  },
  {
    id: 'fullHeal',
    name: 'Full Heal',
    description: 'Cures any status at once. Why carry five bottles?',
    baseCost: 1.6e6,
    salesPerSecond: 2_200,
    sprite: 'full-heal',
  },
  {
    id: 'tmHyperBeam',
    name: 'TM15 Hyper Beam',
    description: 'The most powerful move money can buy. Needs a turn to recharge.',
    baseCost: 1.9e6,
    salesPerSecond: 1_600,
    sprite: 'tm-normal',
  },
  {
    id: 'maxRepel',
    name: 'Max Repel',
    description: 'The longest-lasting Repel. Victory Road regulars swear by it.',
    baseCost: 2.8e6,
    salesPerSecond: 3_000,
    sprite: 'max-repel',
  },
  {
    id: 'hyperPotion',
    name: 'Hyper Potion',
    description: 'Restores 200 HP. Silph Co. ships them straight to your shelves.',
    baseCost: 4.7e6,
    salesPerSecond: 4_600,
    sprite: 'hyper-potion',
  },
  {
    id: 'ultraBall',
    name: 'Ultra Ball',
    description: 'The Safari Zone crowd pays anything for a better catch.',
    baseCost: 5e6,
    salesPerSecond: 3_900,
    sprite: 'ultra-ball',
  },
  {
    id: 'maxPotion',
    name: 'Max Potion',
    description: 'Fully restores HP. The Elite Four does not go easy.',
    baseCost: 26e6,
    salesPerSecond: 16_000,
    sprite: 'max-potion',
  },
  {
    id: 'fullRestore',
    name: 'Full Restore',
    description: 'HP and status in one bottle. The last stop before the Champion.',
    baseCost: 48e6,
    salesPerSecond: 26_000,
    sprite: 'full-restore',
  },
]

const ITEM_NAMES = new Map(ITEMS.map((item) => [item.id, item.name]))

/** "Potion, Antidote" — for lists of items in prose. */
export function itemNames(itemIds: ItemId[]): string {
  return itemIds.map((itemId) => ITEM_NAMES.get(itemId)).join(', ')
}
