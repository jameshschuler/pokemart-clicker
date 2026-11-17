import { describe, expect, it } from 'vitest'
import { ITEMS } from './items'
import { LOCATIONS, newStock, PLAYABLE_LOCATIONS } from './locations'
import { saleValue, STARTING_ITEM, stockBonus, stockOffers } from './stocking'

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

  it('never offers the starting item', () => {
    expect(offeredIds(11)).not.toContain(STARTING_ITEM)
  })

  it('leaves out items that have no price yet', () => {
    expect(offeredIds(3)).toEqual(offeredIds(2))
  })

  it('prices every new item in a playable location', () => {
    const newItems = LOCATIONS.slice(1, PLAYABLE_LOCATIONS).flatMap(newStock)

    expect(offeredIds(PLAYABLE_LOCATIONS)).toEqual(newItems)
  })
})
