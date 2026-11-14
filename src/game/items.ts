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
  /** FireRed/LeafGreen shop price. */
  price: number
  /** One-time cost to stock it franchise-wide. Set as each town is built on the franchise model. */
  stockCost?: number
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
    price: 300,
    sprite: 'potion',
  },
  {
    id: 'antidote',
    name: 'Antidote',
    description: 'Cures poison. Viridian Forest is crawling with Weedle.',
    price: 100,
    stockCost: 1_500,
    sprite: 'antidote',
  },
  {
    id: 'pokeBall',
    name: 'Poké Ball',
    description: 'The classic. Rookies buy them by the dozen.',
    price: 200,
    stockCost: 3_000,
    sprite: 'poke-ball',
  },
  {
    id: 'paralyzeHeal',
    name: 'Paralyze Heal',
    description: 'Cures paralysis. Pikachu fans buy these in bulk.',
    price: 200,
    stockCost: 4_500,
    sprite: 'paralyze-heal',
  },
  {
    id: 'awakening',
    name: 'Awakening',
    description: 'Wakes a sleeping Pokémon. Jigglypuff is a menace.',
    price: 250,
    sprite: 'awakening',
  },
  {
    id: 'burnHeal',
    name: 'Burn Heal',
    description: 'Cures a burn. Popular with anyone training near Charmander.',
    price: 250,
    sprite: 'burn-heal',
  },
  {
    id: 'repel',
    name: 'Repel',
    description: 'Keeps the Zubat away in Mt. Moon. Mostly.',
    price: 350,
    sprite: 'repel',
  },
  {
    id: 'escapeRope',
    name: 'Escape Rope',
    description: 'For anyone lost in a cave. Which is everyone.',
    price: 550,
    sprite: 'escape-rope',
  },
  {
    id: 'superPotion',
    name: 'Super Potion',
    description: 'Restores 50 HP. Gym challengers stock up before Misty.',
    price: 700,
    sprite: 'super-potion',
  },
  {
    id: 'iceHeal',
    name: 'Ice Heal',
    description: 'Thaws a frozen Pokémon. Seafoam Islands regulars keep a few.',
    price: 250,
    sprite: 'ice-heal',
  },
  {
    id: 'freshWater',
    name: 'Fresh Water',
    description: 'Restores 50 HP. The rooftop vending machine sells out on hot days.',
    price: 200,
    sprite: 'fresh-water',
  },
  {
    id: 'sodaPop',
    name: 'Soda Pop',
    description: 'Restores 60 HP. Fizzy, and the machine sometimes drops a second can.',
    price: 300,
    sprite: 'soda-pop',
  },
  {
    id: 'lemonade',
    name: 'Lemonade',
    description: 'Restores 80 HP. The priciest drink on the roof, and the one to trade a guard.',
    price: 350,
    sprite: 'lemonade',
  },
  {
    id: 'xSpeed',
    name: 'X Speed',
    description: 'Raises Speed for one battle. Outrun anything for a few turns.',
    price: 350,
    sprite: 'x-speed',
  },
  {
    id: 'xSpecial',
    name: 'X Special',
    description: 'Raises Special for one battle. Psychic types love it.',
    price: 350,
    sprite: 'x-sp-atk',
  },
  {
    id: 'superRepel',
    name: 'Super Repel',
    description: 'Lasts longer. Rock Tunnel is dark and very long.',
    price: 500,
    sprite: 'super-repel',
  },
  {
    id: 'xAttack',
    name: 'X Attack',
    description: 'Raises Attack for one battle. Trainers buy them by the handful before a Gym.',
    price: 500,
    sprite: 'x-attack',
  },
  {
    id: 'xDefend',
    name: 'X Defend',
    description: 'Raises Defense for one battle. Popular before Brock and his Onix.',
    price: 550,
    sprite: 'x-defense',
  },
  {
    id: 'direHit',
    name: 'Dire Hit',
    description: 'Raises the critical-hit ratio for one battle.',
    price: 650,
    sprite: 'dire-hit',
  },
  {
    id: 'greatBall',
    name: 'Great Ball',
    description: 'Better catch rate. Worth it once the wild Pokémon get tougher.',
    price: 600,
    sprite: 'great-ball',
  },
  {
    id: 'guardSpec',
    name: 'Guard Spec.',
    description: 'Stops stat drops for five turns. Mist in a bottle.',
    price: 700,
    sprite: 'guard-spec',
  },
  {
    id: 'xAccuracy',
    name: 'X Accuracy',
    description: 'Raises accuracy for one battle. Pair it with a one-hit move and pray.',
    price: 950,
    sprite: 'x-accuracy',
  },
  {
    id: 'tmRoar',
    name: 'TM05 Roar',
    description: 'Scares off wild Pokémon. Cheapest TM on the counter.',
    price: 1_000,
    sprite: 'tm-normal',
  },
  {
    id: 'tmDig',
    name: 'TM28 Dig',
    description: 'Burrow underground, then strike. Also gets you out of caves.',
    price: 2_000,
    sprite: 'tm-ground',
  },
  {
    id: 'fireStone',
    name: 'Fire Stone',
    description: 'Evolves Vulpix, Growlithe and Eevee. Warm to the touch.',
    price: 2_100,
    sprite: 'fire-stone',
  },
  {
    id: 'thunderStone',
    name: 'Thunder Stone',
    description: 'Evolves Pikachu and Eevee. Crackles on the shelf.',
    price: 2_100,
    sprite: 'thunder-stone',
  },
  {
    id: 'waterStone',
    name: 'Water Stone',
    description: 'Evolves Shellder, Staryu, Poliwhirl and Eevee.',
    price: 2_100,
    sprite: 'water-stone',
  },
  {
    id: 'leafStone',
    name: 'Leaf Stone',
    description: 'Evolves Gloom, Weepinbell and Exeggcute.',
    price: 2_100,
    sprite: 'leaf-stone',
  },
  {
    id: 'revive',
    name: 'Revive',
    description: 'Brings a fainted Pokémon back. Always the first thing to sell out.',
    price: 1_500,
    sprite: 'revive',
  },
  {
    id: 'tmBrickBreak',
    name: 'TM31 Brick Break',
    description: 'Smashes through Reflect and Light Screen.',
    price: 3_000,
    sprite: 'tm-fighting',
  },
  {
    id: 'tmSecretPower',
    name: 'TM43 Secret Power',
    description: 'Its side effect changes with where you battle.',
    price: 3_000,
    sprite: 'tm-normal',
  },
  {
    id: 'tmAttract',
    name: 'TM45 Attract',
    description: 'Infatuates foes of the opposite gender.',
    price: 3_000,
    sprite: 'tm-normal',
  },
  {
    id: 'hpUp',
    name: 'HP Up',
    description: 'Raises base HP. Pricey, and serious trainers buy them by the box.',
    price: 9_800,
    sprite: 'hp-up',
  },
  {
    id: 'protein',
    name: 'Protein',
    description: 'Raises base Attack.',
    price: 9_800,
    sprite: 'protein',
  },
  {
    id: 'iron',
    name: 'Iron',
    description: 'Raises base Defense.',
    price: 9_800,
    sprite: 'iron',
  },
  {
    id: 'calcium',
    name: 'Calcium',
    description: 'Raises base Special Attack.',
    price: 9_800,
    sprite: 'calcium',
  },
  {
    id: 'zinc',
    name: 'Zinc',
    description: 'Raises base Special Defense.',
    price: 9_800,
    sprite: 'zinc',
  },
  {
    id: 'carbos',
    name: 'Carbos',
    description: 'Raises base Speed.',
    price: 9_800,
    sprite: 'carbos',
  },
  {
    id: 'fullHeal',
    name: 'Full Heal',
    description: 'Cures any status at once. Why carry five bottles?',
    price: 600,
    sprite: 'full-heal',
  },
  {
    id: 'tmHyperBeam',
    name: 'TM15 Hyper Beam',
    description: 'The most powerful move money can buy. Needs a turn to recharge.',
    price: 7_500,
    sprite: 'tm-normal',
  },
  {
    id: 'maxRepel',
    name: 'Max Repel',
    description: 'The longest-lasting Repel. Victory Road regulars swear by it.',
    price: 700,
    sprite: 'max-repel',
  },
  {
    id: 'hyperPotion',
    name: 'Hyper Potion',
    description: 'Restores 200 HP. Silph Co. ships them straight to your shelves.',
    price: 1_200,
    sprite: 'hyper-potion',
  },
  {
    id: 'ultraBall',
    name: 'Ultra Ball',
    description: 'The Safari Zone crowd pays anything for a better catch.',
    price: 1_200,
    sprite: 'ultra-ball',
  },
  {
    id: 'maxPotion',
    name: 'Max Potion',
    description: 'Fully restores HP. The Elite Four does not go easy.',
    price: 2_500,
    sprite: 'max-potion',
  },
  {
    id: 'fullRestore',
    name: 'Full Restore',
    description: 'HP and status in one bottle. The last stop before the Champion.',
    price: 3_000,
    sprite: 'full-restore',
  },
]
