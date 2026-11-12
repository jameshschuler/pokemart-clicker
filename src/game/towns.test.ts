import { describe, expect, it } from 'vitest'
import { ITEMS } from './items'
import { currentTown, isTownOpen, newStock, nextTown, stocks, TOWNS, townById } from './towns'

describe('route data', () => {
  it('costs more to open each town than the last', () => {
    for (let index = 1; index < TOWNS.length; index++) {
      expect(TOWNS[index].openCost).toBeGreaterThan(TOWNS[index - 1].openCost)
      expect(TOWNS[index].requiredSalesPerSecond).toBeGreaterThan(TOWNS[index - 1].requiredSalesPerSecond)
    }
  })

  it('sells every item in at least one mart', () => {
    const sold = new Set(TOWNS.flatMap((town) => town.stock))

    for (const item of ITEMS) {
      expect(sold).toContain(item.id)
    }
  })
})

describe('isTownOpen', () => {
  it.each([
    ['pallet', 1, true],
    ['viridian', 1, false],
    ['viridian', 2, true],
    ['indigoPlateau', 10, false],
    ['indigoPlateau', 11, true],
  ] as const)('%s with %i marts → %s', (townId, martsOwned, expected) => {
    expect(isTownOpen(townId, martsOwned)).toBe(expected)
  })
})

describe('stocks', () => {
  it('follows the real mart inventory', () => {
    expect(stocks('pewter', 'potion')).toBe(true)
    expect(stocks('vermilion', 'potion')).toBe(false)
    expect(stocks('indigoPlateau', 'fullRestore')).toBe(true)
  })
})

describe('newStock', () => {
  it('lists items no earlier mart sells', () => {
    expect(newStock(townById('pewter'))).toEqual(['awakening', 'burnHeal', 'repel', 'escapeRope'])
  })

  it('is empty for a mart with nothing new', () => {
    expect(newStock(townById('cinnabar'))).toEqual([])
  })

  it('counts Pallet as all new', () => {
    expect(newStock(townById('pallet'))).toEqual(['potion'])
  })
})

describe('currentTown and nextTown', () => {
  it('start in Pallet heading to Viridian', () => {
    expect(currentTown(1).id).toBe('pallet')
    expect(nextTown(1)?.id).toBe('viridian')
  })

  it('is undefined once every town is open', () => {
    expect(nextTown(TOWNS.length)).toBeUndefined()
  })
})
