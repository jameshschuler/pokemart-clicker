import type { ItemId } from './items'

export type TownId =
  | 'pallet'
  | 'viridian'
  | 'pewter'
  | 'cerulean'
  | 'vermilion'
  | 'lavender'
  | 'celadon'
  | 'fuchsia'
  | 'saffron'
  | 'cinnabar'
  | 'indigoPlateau'

export interface Town {
  id: TownId
  name: string
  openCost: number
  requiredSalesPerSecond: number
  stock: ItemId[]
}

export const TOWNS: Town[] = [
  {
    id: 'pallet',
    name: 'Pallet Town',
    openCost: 0,
    requiredSalesPerSecond: 0,
    stock: ['potion'],
  },
  {
    id: 'viridian',
    name: 'Viridian City',
    openCost: 180,
    requiredSalesPerSecond: 1.5,
    stock: ['potion', 'antidote', 'pokeBall', 'paralyzeHeal'],
  },
  {
    id: 'pewter',
    name: 'Pewter City',
    openCost: 1_900,
    requiredSalesPerSecond: 16,
    stock: [
      'potion',
      'pokeBall',
      'antidote',
      'paralyzeHeal',
      'awakening',
      'burnHeal',
      'repel',
      'escapeRope',
    ],
  },
  {
    id: 'cerulean',
    name: 'Cerulean City',
    openCost: 13_000,
    requiredSalesPerSecond: 110,
    stock: [
      'potion',
      'pokeBall',
      'antidote',
      'paralyzeHeal',
      'awakening',
      'burnHeal',
      'repel',
      'escapeRope',
      'superPotion',
    ],
  },
  {
    id: 'vermilion',
    name: 'Vermilion City',
    openCost: 70_000,
    requiredSalesPerSecond: 600,
    stock: ['pokeBall', 'antidote', 'paralyzeHeal', 'awakening', 'repel', 'superPotion', 'iceHeal'],
  },
  {
    id: 'lavender',
    name: 'Lavender Town',
    openCost: 240_000,
    requiredSalesPerSecond: 2_000,
    stock: [
      'antidote',
      'paralyzeHeal',
      'burnHeal',
      'iceHeal',
      'escapeRope',
      'superPotion',
      'superRepel',
      'greatBall',
    ],
  },
  {
    id: 'celadon',
    name: 'Celadon City',
    openCost: 920_000,
    requiredSalesPerSecond: 7_700,
    stock: [
      'antidote',
      'paralyzeHeal',
      'awakening',
      'burnHeal',
      'iceHeal',
      'superPotion',
      'superRepel',
      'greatBall',
      'xItems',
      'revive',
      'evolutionStones',
      'tms',
      'vitamins',
    ],
  },
  {
    id: 'fuchsia',
    name: 'Fuchsia City',
    openCost: 4.1e6,
    requiredSalesPerSecond: 34_000,
    stock: ['superPotion', 'greatBall', 'revive', 'fullHeal', 'maxRepel', 'ultraBall'],
  },
  {
    id: 'saffron',
    name: 'Saffron City',
    openCost: 13e6,
    requiredSalesPerSecond: 110_000,
    stock: ['escapeRope', 'greatBall', 'revive', 'fullHeal', 'maxRepel', 'hyperPotion'],
  },
  {
    id: 'cinnabar',
    name: 'Cinnabar Island',
    openCost: 32e6,
    requiredSalesPerSecond: 270_000,
    stock: [
      'escapeRope',
      'greatBall',
      'revive',
      'fullHeal',
      'ultraBall',
      'maxRepel',
      'hyperPotion',
    ],
  },
  {
    id: 'indigoPlateau',
    name: 'Indigo Plateau',
    openCost: 71e6,
    requiredSalesPerSecond: 590_000,
    stock: ['greatBall', 'revive', 'fullHeal', 'ultraBall', 'maxRepel', 'maxPotion', 'fullRestore'],
  },
]

const ROUTE_ORDER = new Map(TOWNS.map((town, index) => [town.id, index]))
const STOCK_BY_TOWN = new Map(TOWNS.map((town) => [town.id, new Set(town.stock)]))

export function townById(townId: TownId): Town {
  return TOWNS[ROUTE_ORDER.get(townId) ?? 0]
}

export function isTownOpen(townId: TownId, martsOwned: number): boolean {
  return (ROUTE_ORDER.get(townId) ?? TOWNS.length) < martsOwned
}

export function stocks(townId: TownId, itemId: ItemId): boolean {
  return STOCK_BY_TOWN.get(townId)?.has(itemId) ?? false
}

/** The most recently opened mart. */
export function currentTown(martsOwned: number): Town {
  return TOWNS[martsOwned - 1]
}

export function nextTown(martsOwned: number): Town | undefined {
  return TOWNS[martsOwned]
}

/** Items a town's mart is the first on the route to sell. */
export function newStock(town: Town): ItemId[] {
  const earlier = new Set(TOWNS.slice(0, ROUTE_ORDER.get(town.id)).flatMap((stop) => stop.stock))

  return town.stock.filter((itemId) => !earlier.has(itemId))
}
