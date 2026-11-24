import { describe, expect, it } from 'vitest'
import { type ItemId, ITEMS } from './items'
import { LOCATIONS, locationById, newStock, PLAYABLE_LOCATIONS } from './locations'
import { saleValue, STARTING_ITEM, stockBonus, stockOffers, unstockedFirst } from './stocking'

describe('stockBonus', () => {
  it.each([
    ['antidote', 0.1],
    ['pokeBall', 0.2],
    ['hpUp', 9.8],
  ] as const)('%s adds %d', (itemId, expected) => {
    const item = ITEMS.find((candidate) => candidate.id === itemId)!

    expect(stockBonus(item)).toBeCloseTo(expected)
  })
})

describe('saleValue', () => {
  it('is ₽1 with nothing stocked', () => {
    expect(saleValue([])).toBe(1)
  })

  it('adds every stocked item', () => {
    expect(saleValue(['antidote', 'pokeBall', 'paralyzeHeal'])).toBeCloseTo(1.5)
  })
})

describe('stockOffers', () => {
  const offeredIds = (martsOwned: number) => stockOffers(martsOwned).map((offer) => offer.item.id)

  it('has nothing to stock in Pallet beyond the starting Potion', () => {
    expect(stockOffers(1)).toEqual([])
  })

  it("offers Viridian's new items with their costs once it opens", () => {
    expect(stockOffers(2).map((offer) => [offer.item.id, offer.cost])).toEqual([
      ['antidote', 1_500],
      ['pokeBall', 3_000],
      ['paralyzeHeal', 4_500],
    ])
  })

  it("adds Pewter's new items with their costs once it opens", () => {
    const pewterItems = new Set(newStock(locationById('pewter')))
    const pewterOffers = stockOffers(3).filter((offer) => pewterItems.has(offer.item.id))

    expect(pewterOffers.map((offer) => [offer.item.id, offer.cost])).toEqual([
      ['awakening', 20_000],
      ['burnHeal', 30_000],
      ['repel', 50_000],
      ['escapeRope', 80_000],
    ])
  })

  it("adds Cerulean's Super Potion once it opens", () => {
    const superPotion = stockOffers(4).find((offer) => offer.item.id === 'superPotion')

    expect(superPotion?.cost).toBe(700_000)
  })

  it('never offers the starting item', () => {
    expect(offeredIds(11)).not.toContain(STARTING_ITEM)
  })

  it('leaves out items that have no price yet', () => {
    expect(offeredIds(PLAYABLE_LOCATIONS + 1)).toEqual(offeredIds(PLAYABLE_LOCATIONS))
  })

  it('prices every new item in a playable location', () => {
    const newItems = LOCATIONS.slice(1, PLAYABLE_LOCATIONS).flatMap(newStock)

    expect(offeredIds(PLAYABLE_LOCATIONS)).toEqual(newItems)
  })
})

describe('unstockedFirst', () => {
  const ids = (stockedItems: ItemId[]) =>
    unstockedFirst(stockOffers(3), stockedItems).map((offer) => offer.item.id)

  it.each([
    [[], ['antidote', 'pokeBall', 'paralyzeHeal', 'awakening', 'burnHeal', 'repel', 'escapeRope']],
    [
      ['antidote', 'repel'],
      ['pokeBall', 'paralyzeHeal', 'awakening', 'burnHeal', 'escapeRope', 'antidote', 'repel'],
    ],
  ] as const)('with %j stocked lists %j', (stockedItems, expected) => {
    expect(ids([...stockedItems])).toEqual(expected)
  })
})
