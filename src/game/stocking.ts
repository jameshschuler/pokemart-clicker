import { ITEMS, type Item, type ItemId } from './items'
import { newStock, TOWNS } from './towns'

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

/** Items the franchise can stock: every open town's new items that have a price. */
export function stockOffers(martsOwned: number): StockOffer[] {
  const offered = new Set(TOWNS.slice(0, martsOwned).flatMap(newStock))
  offered.delete(STARTING_ITEM)

  return ITEMS.flatMap((item) =>
    offered.has(item.id) && item.stockCost !== undefined ? [{ item, cost: item.stockCost }] : [],
  )
}
