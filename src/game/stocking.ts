import { type Item, type ItemId, ITEMS } from './items'
import { CELADON_FLOORS, LOCATIONS, type MartLocation, newStock, openStock } from './locations'

/** Pallet's Potions: stocked from the start and worth the base ₽1 sale. */
export const STARTING_ITEM: ItemId = 'potion'

/** +1% sale value per ₽10 of FRLG price, unless the item's location sets its own rate. */
const BONUS_PER_PRICE = 1 / 1_000

const INTRODUCED_AT = new Map<ItemId, MartLocation>(
  LOCATIONS.flatMap((location) => newStock(location).map((itemId) => [itemId, location] as const)),
)

export function stockBonus(item: Item): number {
  return item.price * (INTRODUCED_AT.get(item.id)?.bonusPerPrice ?? BONUS_PER_PRICE)
}

/** What one sale is worth: ₽1 plus every stocked item's bonus. */
export function saleValue(stockedItems: ItemId[]): number {
  const stocked = new Set(stockedItems)

  return ITEMS.filter((item) => stocked.has(item.id)).reduce(
    (sum, item) => sum + stockBonus(item),
    1,
  )
}

export interface StockOffer {
  item: Item
  cost: number
}

/** Items the franchise can stock: every open location's new items on open floors that have a price. */
export function stockOffers(martsOwned: number, floorsOpen: number): StockOffer[] {
  const offered = new Set(
    LOCATIONS.slice(0, martsOwned).flatMap((location) => {
      const onSale = new Set(openStock(location, floorsOpen))

      return newStock(location).filter((itemId) => onSale.has(itemId))
    }),
  )
  offered.delete(STARTING_ITEM)

  return ITEMS.flatMap((item) =>
    offered.has(item.id) && item.stockCost !== undefined ? [{ item, cost: item.stockCost }] : [],
  )
}

export interface StockSection {
  /** A Department Store floor's name; the rest of the franchise's items have none. */
  floor?: string
  offers: StockOffer[]
}

/** Offers split into the franchise's items, then one section per open Department Store floor. */
export function stockSections(offers: StockOffer[], floorsOpen: number): StockSection[] {
  const isCeladonItem = (offer: StockOffer) => INTRODUCED_AT.get(offer.item.id)?.id === 'celadon'
  const floorSections = CELADON_FLOORS.slice(0, floorsOpen).map((floor) => {
    const onFloor = new Set(floor.stock)

    return {
      floor: floor.name,
      offers: offers.filter((offer) => isCeladonItem(offer) && onFloor.has(offer.item.id)),
    }
  })

  return [{ offers: offers.filter((offer) => !isCeladonItem(offer)) }, ...floorSections].filter(
    (section) => section.offers.length > 0,
  )
}

export interface StockBoard {
  /** Items still to stock, in sections like `stockSections`. */
  toStock: StockSection[]
  stocked: StockOffer[]
}

export function stockBoard(
  offers: StockOffer[],
  floorsOpen: number,
  stockedItems: ItemId[],
): StockBoard {
  const stocked = new Set(stockedItems)
  const unstocked = offers.filter((offer) => !stocked.has(offer.item.id))

  return {
    toStock: stockSections(unstocked, floorsOpen),
    stocked: offers.filter((offer) => stocked.has(offer.item.id)),
  }
}
