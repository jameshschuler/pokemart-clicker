import { type Item, type ItemId, ITEMS } from './items'

export type LocationId =
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
  /** What it costs to open; the first floor opens with its location. */
  openCost?: number
}

export interface MartLocation {
  id: LocationId
  name: string
  openCost: number
  requiredIncome: number
  stock: ItemId[]
  /** Defaults to "<location> Mart". */
  storeName?: string
  floors?: Floor[]
  /** Sale value each of its new items adds per ₽ of FRLG price. */
  bonusPerPrice?: number
}

/** The FRLG Department Store's selling floors and rooftop. Potions through Escape Ropes are added to 2F. */
export const CELADON_FLOORS: Floor[] = [
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
  {
    name: '4F · Wise Man Gifts',
    stock: ['fireStone', 'thunderStone', 'waterStone', 'leafStone'],
    openCost: 1e9,
  },
  {
    name: '5F · Drugstore',
    openCost: 2e9,
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
  { name: 'Roof · Vending Machines', stock: ['freshWater', 'sodaPop', 'lemonade'], openCost: 3e9 },
]

export const LOCATIONS: MartLocation[] = [
  {
    id: 'pallet',
    name: 'Pallet Town',
    openCost: 0,
    requiredIncome: 0,
    stock: ['potion'],
  },
  {
    id: 'viridian',
    name: 'Viridian City',
    openCost: 1_000,
    requiredIncome: 5,
    stock: ['potion', 'antidote', 'pokeBall', 'paralyzeHeal'],
  },
  {
    id: 'pewter',
    name: 'Pewter City',
    openCost: 20_000,
    requiredIncome: 150,
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
    openCost: 500_000,
    requiredIncome: 4_000,
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
    openCost: 15e6,
    requiredIncome: 80_000,
    stock: ['pokeBall', 'antidote', 'paralyzeHeal', 'awakening', 'repel', 'superPotion', 'iceHeal'],
  },
  {
    id: 'lavender',
    name: 'Lavender Town',
    openCost: 100e6,
    requiredIncome: 400_000,
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
    openCost: 300e6,
    requiredIncome: 1.5e6,
    storeName: 'Celadon City Department Store',
    floors: CELADON_FLOORS,
    bonusPerPrice: 1 / 10_000,
    stock: CELADON_FLOORS.flatMap((floor) => floor.stock),
  },
  {
    id: 'fuchsia',
    name: 'Fuchsia City',
    openCost: 2e9,
    requiredIncome: 10e6,
    stock: ['superPotion', 'greatBall', 'revive', 'fullHeal', 'maxRepel', 'ultraBall'],
  },
  {
    id: 'saffron',
    name: 'Saffron City',
    openCost: 15e9,
    requiredIncome: 70e6,
    stock: ['escapeRope', 'greatBall', 'revive', 'fullHeal', 'maxRepel', 'hyperPotion'],
  },
  {
    id: 'cinnabar',
    name: 'Cinnabar Island',
    openCost: 100e9,
    requiredIncome: 500e6,
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
    openCost: 700e9,
    requiredIncome: 3e9,
    stock: ['greatBall', 'revive', 'fullHeal', 'ultraBall', 'maxRepel', 'maxPotion', 'fullRestore'],
  },
]

/** Locations built on the franchise model so far; the rest open in later build steps. */
export const PLAYABLE_LOCATIONS = 7

const ROUTE_ORDER = new Map(LOCATIONS.map((location, index) => [location.id, index]))

export function locationById(locationId: LocationId): MartLocation {
  return LOCATIONS[ROUTE_ORDER.get(locationId) ?? 0]
}

export function isLocationOpen(locationId: LocationId, martsOwned: number): boolean {
  return (ROUTE_ORDER.get(locationId) ?? LOCATIONS.length) < martsOwned
}

/** The next location the franchise can open, if any. */
export function nextLocation(martsOwned: number): MartLocation | undefined {
  return martsOwned < PLAYABLE_LOCATIONS ? LOCATIONS[martsOwned] : undefined
}

/** Items a location is the first on the route to sell. */
export function newStock(location: MartLocation): ItemId[] {
  const earlier = new Set(
    LOCATIONS.slice(0, ROUTE_ORDER.get(location.id)).flatMap((earlier) => earlier.stock),
  )

  return location.stock.filter((itemId) => !earlier.has(itemId))
}

/** "Viridian City" → "Viridian", for tight spaces. */
export function shortLocationName(location: MartLocation): string {
  return location.name.replace(/ (Town|City|Island)$/, '')
}

export function storeName(location: MartLocation): string {
  return location.storeName ?? `${location.name} Mart`
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
export function storeItems(location: MartLocation): Item[] {
  return itemsIn(location.stock)
}

/** A store's items grouped by floor, or undefined for a single-floor mart. */
export function storeFloors(location: MartLocation): FloorSection[] | undefined {
  return location.floors?.map((floor) => ({ name: floor.name, items: itemsIn(floor.stock) }))
}

/** What a location sells with `floorsOpen` floors open; locations without floors sell everything. */
export function openStock(location: MartLocation, floorsOpen: number): ItemId[] {
  return location.floors
    ? location.floors.slice(0, floorsOpen).flatMap((floor) => floor.stock)
    : location.stock
}

/** The Department Store's next floor to open, once Celadon is open. */
export function nextFloor(martsOwned: number, floorsOpen: number): Floor | undefined {
  return isLocationOpen('celadon', martsOwned) ? CELADON_FLOORS[floorsOpen] : undefined
}

/** A floor's label without its department name: "4F · Wise Man Gifts" → "4F". */
export function shortFloorName(floor: Floor): string {
  return floor.name.split(' · ')[0]
}
