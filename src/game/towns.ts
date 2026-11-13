import { ITEMS, type Item, type ItemId } from './items'

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

export interface Floor {
  name: string
  stock: ItemId[]
}

export interface Town {
  id: TownId
  name: string
  openCost: number
  requiredSalesPerSecond: number
  stock: ItemId[]
  /** Defaults to "<town> Mart". */
  storeName?: string
  floors?: Floor[]
}

/** The FRLG Department Store's selling floors and rooftop. Potions through Escape Ropes are added to 2F. */
const CELADON_FLOORS: Floor[] = [
  {
    name: "2F · Trainer's Market",
    stock: [
      'potion',
      'antidote',
      'pokeBall',
      'paralyzeHeal',
      'awakening',
      'burnHeal',
      'repel',
      'escapeRope',
      'superPotion',
      'iceHeal',
      'superRepel',
      'greatBall',
      'revive',
      'tmRoar',
      'tmHyperBeam',
      'tmDig',
      'tmBrickBreak',
      'tmSecretPower',
      'tmAttract',
    ],
  },
  { name: '4F · Wise Man Gifts', stock: ['fireStone', 'thunderStone', 'waterStone', 'leafStone'] },
  {
    name: '5F · Drugstore',
    stock: [
      'xAttack',
      'xDefend',
      'xSpeed',
      'xSpecial',
      'xAccuracy',
      'guardSpec',
      'direHit',
      'hpUp',
      'protein',
      'iron',
      'calcium',
      'zinc',
      'carbos',
    ],
  },
  { name: 'Roof · Vending Machines', stock: ['freshWater', 'sodaPop', 'lemonade'] },
]

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
    storeName: 'Celadon City Department Store',
    floors: CELADON_FLOORS,
    stock: CELADON_FLOORS.flatMap((floor) => floor.stock),
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

export function townById(townId: TownId): Town {
  return TOWNS[ROUTE_ORDER.get(townId) ?? 0]
}

export function isTownOpen(townId: TownId, martsOwned: number): boolean {
  return (ROUTE_ORDER.get(townId) ?? TOWNS.length) < martsOwned
}

export function storeName(town: Town): string {
  return town.storeName ?? `${town.name} Mart`
}

export interface FloorSection {
  name: string
  items: Item[]
}

function itemsIn(stock: ItemId[]): Item[] {
  const stocked = new Set(stock)

  return ITEMS.filter((item) => stocked.has(item.id))
}

/** Everything a store sells, in route-ladder order. */
export function storeItems(town: Town): Item[] {
  return itemsIn(town.stock)
}

/** A store's items grouped by floor, or undefined for a single-floor mart. */
export function storeFloors(town: Town): FloorSection[] | undefined {
  return town.floors?.map((floor) => ({ name: floor.name, items: itemsIn(floor.stock) }))
}
