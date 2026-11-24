import { type Item, type ItemId, ITEMS } from './items'
import { LOCATIONS, newStock } from './locations'

/** Pallet's Potions: stocked from the start and worth the base ₽1 sale. */
export const STARTING_ITEM: ItemId = 'potion'

/** +1% sale value per ₽10 of FRLG price. */
export function stockBonus(item: Item): number {
  return item.price / 1_000
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

/** Items the franchise can stock: every open location's new items that have a price. */
export function stockOffers(martsOwned: number): StockOffer[] {
  const offered = new Set(LOCATIONS.slice(0, martsOwned).flatMap(newStock))
  offered.delete(STARTING_ITEM)

  return ITEMS.flatMap((item) =>
    offered.has(item.id) && item.stockCost !== undefined ? [{ item, cost: item.stockCost }] : [],
  )
}

/** Offers still to stock first, then stocked ones, each in their original order. */
export function unstockedFirst(offers: StockOffer[], stockedItems: ItemId[]): StockOffer[] {
  const stocked = new Set(stockedItems)

  return [
    ...offers.filter((offer) => !stocked.has(offer.item.id)),
    ...offers.filter((offer) => stocked.has(offer.item.id)),
  ]
}
