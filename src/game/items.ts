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
  | 'superRepel'
  | 'greatBall'
  | 'xItems'
  | 'revive'
  | 'evolutionStones'
  | 'fullHeal'
  | 'tms'
  | 'maxRepel'
  | 'vitamins'
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
  /** PokeAPI sprite name; grouped items use one member (X Attack, Protein, a Normal TM, Fire Stone). */
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
    id: 'superRepel',
    name: 'Super Repel',
    description: 'Lasts longer. Rock Tunnel is dark and very long.',
    baseCost: 89_000,
    salesPerSecond: 190,
    sprite: 'super-repel',
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
    id: 'xItems',
    name: 'X Items',
    description: 'X Attack, X Speed, Dire Hit and friends. One battle, big boost.',
    baseCost: 350_000,
    salesPerSecond: 600,
    sprite: 'x-attack',
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
    id: 'evolutionStones',
    name: 'Evolution Stones',
    description: 'Fire, Water, Thunder and Leaf. Collectors want the full set.',
    baseCost: 1.1e6,
    salesPerSecond: 1_300,
    sprite: 'fire-stone',
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
    id: 'tms',
    name: 'TMs',
    description: 'Teach a move in seconds. The department store can barely keep up.',
    baseCost: 2e6,
    salesPerSecond: 1_700,
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
    id: 'vitamins',
    name: 'Vitamins',
    description: 'HP Up, Protein, Iron, Carbos and Calcium. Pricey, and they fly off the shelf.',
    baseCost: 3.6e6,
    salesPerSecond: 2_500,
    sprite: 'protein',
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
