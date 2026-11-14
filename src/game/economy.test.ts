import { describe, expect, it } from 'vitest'
import {
  bulkCost,
  clickValue,
  franchiseBonus,
  franchiseMultiplier,
  incomePerSecond,
  maxAffordable,
  openRequirements,
  producerIncome,
  purchaseQuote,
  salesPerSecond,
} from './economy'
import { formatDuration, formatMoney, formatPercent, formatRate, formatWholeMoney } from './format'
import { PRODUCERS } from './producers'
import { emptyProducers, initialState } from './store'

const [FLYER] = PRODUCERS

describe('bulkCost', () => {
  it('matches summing single purchases', () => {
    let sum = 0
    for (let i = 3; i < 13; i++) sum += 15 * 1.15 ** i
    expect(bulkCost(15, 3, 10)).toBeCloseTo(sum, 6)
  })

  it('is zero for zero units', () => {
    expect(bulkCost(15, 5, 0)).toBe(0)
  })
})

describe('maxAffordable', () => {
  it('returns 0 when the next unit is too expensive', () => {
    expect(maxAffordable(15, 0, 14.99)).toBe(0)
  })

  it('buys exactly at the boundary', () => {
    const coins = bulkCost(15, 0, 7)
    expect(maxAffordable(15, 0, coins)).toBe(7)
  })

  it('never exceeds coins', () => {
    for (const coins of [15, 100, 1234.5, 99_999]) {
      const n = maxAffordable(15, 4, coins)
      expect(bulkCost(15, 4, n)).toBeLessThanOrEqual(coins)
      expect(bulkCost(15, 4, n + 1)).toBeGreaterThan(coins)
    }
  })
})

describe('purchaseQuote', () => {
  it('quotes at least one unit for max', () => {
    expect(purchaseQuote(100, 0, 0, 'max')).toEqual({ count: 1, cost: 100 })
  })

  it.each([1, 10] as const)('quotes ×%s past 100 owned', (amount) => {
    expect(purchaseQuote(15, 100, 1e30, amount).count).toBe(amount)
  })
})

describe('salesPerSecond', () => {
  it('adds up every producer', () => {
    expect(salesPerSecond({ ...emptyProducers(), flyer: 3 })).toBeCloseTo(0.3)
  })

  it('is zero with no producers', () => {
    expect(salesPerSecond(emptyProducers())).toBe(0)
  })
})

describe('producerIncome', () => {
  const franchise = initialState()

  it('is a flyer’s sales times the sale value', () => {
    expect(producerIncome(franchise, FLYER)).toBeCloseTo(0.1)
  })

  it('includes the franchise bonus', () => {
    expect(producerIncome({ ...franchise, martsOwned: 3 }, FLYER)).toBeCloseTo(0.11)
  })
})

describe('incomePerSecond', () => {
  const franchise = initialState()

  it('is sales per second times the sale value, with the franchise bonus', () => {
    const grown = { ...franchise, martsOwned: 2, producers: { ...emptyProducers(), flyer: 10 } }

    expect(incomePerSecond(grown)).toBeCloseTo(1.05)
  })

  it('grows with stocked items', () => {
    const stocked = {
      ...franchise,
      producers: { ...emptyProducers(), flyer: 10 },
      stockedItems: ['antidote' as const],
    }

    expect(incomePerSecond(stocked)).toBeCloseTo(1.1)
  })

  it('is zero with no producers', () => {
    expect(incomePerSecond({ ...franchise, martsOwned: 11 })).toBe(0)
  })
})

describe('franchiseBonus', () => {
  it('splits the bonus by source', () => {
    const franchise = initialState()
    const grown = {
      ...franchise,
      martsOwned: 3,
      achievements: { ...franchise.achievements, customersServed: 2, idleHands: 1 },
    }

    expect(franchiseBonus(grown)).toEqual({
      extraTowns: 2,
      achievementTiers: 3,
      fromTowns: 0.1,
      fromAchievements: 0.03,
    })
  })
})

describe('franchiseMultiplier', () => {
  const franchise = initialState()

  it.each([
    [1, 1],
    [2, 1.05],
    [11, 1.5],
  ])('with %i towns is %d', (martsOwned, expected) => {
    expect(franchiseMultiplier({ ...franchise, martsOwned })).toBeCloseTo(expected)
  })

  it('adds +1% per achievement tier', () => {
    const achieved = {
      ...franchise,
      achievements: { ...franchise.achievements, totalEarned: 3, idleHands: 1 },
    }

    expect(franchiseMultiplier(achieved)).toBeCloseTo(1.04)
  })
})

describe('clickValue', () => {
  it.each([
    [[], 1_000, 1],
    [['secondTill'], 1_000, 2],
    [['secondTill', 'meowthCoinCounter', 'machopBagger', 'electricTill'], 1_000, 16],
    [['barcodeScanner'], 1_000, 11],
    [['secondTill', 'barcodeScanner', 'loyaltyStamps'], 1_000, 22],
    [['barcodeScanner'], 0, 1],
  ] as const)('with %j at ₽%d/s is ₽%d', (upgrades, income, expected) => {
    expect(clickValue([...upgrades], 1, income)).toBeCloseTo(expected)
  })

  it('doubles the sale value, not just ₽1', () => {
    expect(clickValue(['secondTill'], 1.5, 0)).toBeCloseTo(3)
  })
})

describe('openRequirements', () => {
  const franchise = initialState()
  const busy = { ...franchise, producers: { ...emptyProducers(), deliveryBike: 5 } }

  it('is ready for Viridian with ₽5/s and ₽1,000', () => {
    expect(openRequirements(busy, 1_000)).toMatchObject({
      town: { id: 'viridian' },
      hasCoins: true,
      hasIncome: true,
      ready: true,
    })
  })

  it.each([
    ['coins', busy, 999],
    ['income', franchise, 1e9],
  ])('is not ready without enough %s', (_, state, coins) => {
    expect(openRequirements(state, coins)?.ready).toBe(false)
  })

  it('is undefined once every playable town is open', () => {
    expect(openRequirements({ ...franchise, martsOwned: 2 }, 1e9)).toBeUndefined()
  })
})

describe('format', () => {
  it('formats money', () => {
    expect(formatMoney(999.9)).toBe('999')
    expect(formatMoney(12_345)).toBe('12,345')
    expect(formatMoney(1_234_567)).toBe('1.23M')
    expect(formatMoney(45_600_000_000)).toBe('45.6B')
  })

  it.each([
    [999_999_999, '999M'],
    [9_999_999, '9.99M'],
    [1_150_000, '1.15M'],
    [1e9, '1.00B'],
  ])('formatMoney truncates %d to %s without overflowing its suffix', (value, expected) => {
    expect(formatMoney(value)).toBe(expected)
  })

  it.each([
    [0, '0s'],
    [45.9, '45s'],
    [754, '12m 34s'],
    [3_600, '1h'],
    [7_380, '2h 3m'],
  ])('formats %d seconds as %s', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected)
  })

  it('formats percents', () => {
    expect(formatPercent(0)).toBe('0%')
    expect(formatPercent(0.15)).toBe('15%')
    expect(formatPercent(0.05 * 3)).toBe('15%')
  })

  it('formats rates', () => {
    expect(formatRate(0.1)).toBe('0.1')
    expect(formatRate(34.25)).toBe('34.3')
    expect(formatRate(1_500)).toBe('1,500')
  })
})

describe('formatWholeMoney', () => {
  it.each([
    [0, '0'],
    [999.9, '999'],
    [1_040_123.9, '1,040,123'],
    [45_600_000_000, '45,600,000,000'],
  ])('shows %d as %s', (value, expected) => {
    expect(formatWholeMoney(value)).toBe(expected)
  })
})
