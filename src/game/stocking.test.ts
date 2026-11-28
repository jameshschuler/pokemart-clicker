import { describe, expect, it } from 'vitest'
import { ITEMS } from './items'
import { CELADON_FLOORS, LOCATIONS, locationById, newStock, PLAYABLE_LOCATIONS } from './locations'
import {
  saleValue,
  STARTING_ITEM,
  stockBonus,
  stockOffers,
  stockBoard,
  stockSections,
} from './stocking'

describe('stockBonus', () => {
  it.each([
    ['antidote', 0.1],
    ['pokeBall', 0.2],
    ['greatBall', 0.6],
    ['revive', 0.15],
    ['hpUp', 0.98],
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
  const offeredIds = (martsOwned: number) =>
    stockOffers(martsOwned, 1).map((offer) => offer.item.id)

  it('has nothing to stock in Pallet beyond the starting Potion', () => {
    expect(stockOffers(1, 1)).toEqual([])
  })

  it("offers Viridian's new items with their costs once it opens", () => {
    expect(stockOffers(2, 1).map((offer) => [offer.item.id, offer.cost])).toEqual([
      ['antidote', 1_500],
      ['pokeBall', 3_000],
      ['paralyzeHeal', 4_500],
    ])
  })

  it("adds Pewter's new items with their costs once it opens", () => {
    const pewterItems = new Set(newStock(locationById('pewter')))
    const pewterOffers = stockOffers(3, 1).filter((offer) => pewterItems.has(offer.item.id))

    expect(pewterOffers.map((offer) => [offer.item.id, offer.cost])).toEqual([
      ['awakening', 20_000],
      ['burnHeal', 30_000],
      ['repel', 50_000],
      ['escapeRope', 80_000],
    ])
  })

  it("adds Cerulean's Super Potion once it opens", () => {
    const superPotion = stockOffers(4, 1).find((offer) => offer.item.id === 'superPotion')

    expect(superPotion?.cost).toBe(700_000)
  })

  it("adds Vermilion's Ice Heal once it opens", () => {
    const iceHeal = stockOffers(5, 1).find((offer) => offer.item.id === 'iceHeal')

    expect(iceHeal?.cost).toBe(5_000_000)
  })

  it.each([
    ['superRepel', 50_000_000],
    ['greatBall', 70_000_000],
  ])("adds Lavender's %s once it opens", (itemId, cost) => {
    const offer = stockOffers(6, 1).find((stockOffer) => stockOffer.item.id === itemId)

    expect(offer?.cost).toBe(cost)
  })

  it('never offers the starting item', () => {
    expect(offeredIds(11)).not.toContain(STARTING_ITEM)
  })

  it('leaves out items that have no price yet', () => {
    expect(offeredIds(PLAYABLE_LOCATIONS + 1)).toEqual(offeredIds(PLAYABLE_LOCATIONS))
  })

  it('prices every new item in a playable location once every floor is open', () => {
    const newItems = LOCATIONS.slice(1, PLAYABLE_LOCATIONS).flatMap(newStock)
    const offered = stockOffers(PLAYABLE_LOCATIONS, CELADON_FLOORS.length).map(
      (offer) => offer.item.id,
    )

    expect(new Set(offered)).toEqual(new Set(newItems))
  })

  it.each([
    [1, ['revive', 'tmHyperBeam'], ['fireStone', 'hpUp', 'lemonade']],
    [2, ['revive', 'fireStone'], ['hpUp', 'lemonade']],
    [4, ['revive', 'fireStone', 'hpUp', 'lemonade'], []],
  ] as const)('with %i Celadon floors open offers %j but not %j', (floorsOpen, offered, held) => {
    const ids = new Set(stockOffers(7, floorsOpen).map((offer) => offer.item.id))

    expect(offered.filter((itemId) => !ids.has(itemId))).toEqual([])
    expect(held.filter((itemId) => ids.has(itemId))).toEqual([])
  })
})

describe('Fuchsia stock', () => {
  it.each([
    ['fullHeal', 3e9],
    ['maxRepel', 4e9],
    ['ultraBall', 8e9],
  ])("adds Fuchsia's %s for %d once it opens", (itemId, cost) => {
    const offer = stockOffers(8, 1).find((stockOffer) => stockOffer.item.id === itemId)

    expect(offer?.cost).toBe(cost)
  })
})

describe('stockSections', () => {
  it('has only the franchise section before Celadon opens', () => {
    const sections = stockSections(stockOffers(6, 1), 1)

    expect(sections.map((section) => section.floor)).toEqual([undefined])
  })

  it('adds one section per open floor, in floor order', () => {
    const sections = stockSections(stockOffers(7, 2), 2)

    expect(sections.map((section) => section.floor)).toEqual([
      undefined,
      CELADON_FLOORS[0].name,
      CELADON_FLOORS[1].name,
    ])
    expect(sections[2].offers.map((offer) => offer.item.id)).toEqual(CELADON_FLOORS[1].stock)
  })

  it('leaves out an empty franchise section', () => {
    const sections = stockSections(
      stockOffers(7, 1).filter((offer) => offer.item.id === 'revive'),
      1,
    )

    expect(sections.map((section) => section.floor)).toEqual([CELADON_FLOORS[0].name])
  })
})

describe('stockBoard', () => {
  it('splits offers into sections still to stock and a stocked list', () => {
    const board = stockBoard(stockOffers(3, 1), 1, ['antidote', 'repel'])

    expect(board.toStock.map((section) => section.offers.map((offer) => offer.item.id))).toEqual([
      ['pokeBall', 'paralyzeHeal', 'awakening', 'burnHeal', 'escapeRope'],
    ])
    expect(board.stocked.map((offer) => offer.item.id)).toEqual(['antidote', 'repel'])
  })

  it('drops a floor once everything on it is stocked', () => {
    const board = stockBoard(stockOffers(7, 1), 1, newStock(locationById('celadon')))

    expect(board.toStock.map((section) => section.floor)).toEqual([undefined])
  })

  it('has nothing to stock once everything is stocked', () => {
    const offers = stockOffers(2, 1)
    const board = stockBoard(
      offers,
      1,
      offers.map((offer) => offer.item.id),
    )

    expect(board.toStock).toEqual([])
  })
})
