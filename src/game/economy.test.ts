import { describe, expect, it } from 'vitest'
import {
  bulkCost,
  clickIncomeShare,
  clickSaleMultiplier,
  clickValue,
  franchiseBonus,
  franchiseMultiplier,
  incomePerSecond,
  maxAffordable,
  openRequirements,
  producerIncome,
  purchaseQuote,
  secondsUntilAffordable,
  salesPerSecond,
} from './economy'
import {
  formatDuration,
  formatMoney,
  formatPercent,
  formatPrice,
  formatRate,
  formatWholeMoney,
} from './format'
import { PLAYABLE_LOCATIONS } from './locations'
import { PRODUCERS } from './producers'
import { emptyProducers, initialState } from './store'

const [HELPING_HAND] = PRODUCERS

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

describe('secondsUntilAffordable', () => {
  it.each([
    ['affordable now', 100, 150, 10, 0],
    ['exactly enough', 100, 100, 0, 0],
    ['saving up', 130_000, 30_000, 500, 200],
    ['no income', 100, 50, 0, Infinity],
  ])('%s', (_, cost, coins, income, expected) => {
    expect(secondsUntilAffordable(cost, coins, income)).toBe(expected)
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
    expect(salesPerSecond({ ...emptyProducers(), helpingHand: 3 })).toBeCloseTo(0.3)
  })

  it('is zero with no producers', () => {
    expect(salesPerSecond(emptyProducers())).toBe(0)
  })
})

describe('producerIncome', () => {
  const franchise = initialState()

  it('is a helping hand’s sales times the sale value', () => {
    expect(producerIncome(franchise, HELPING_HAND)).toBeCloseTo(0.1)
  })

  it('includes the franchise bonus', () => {
    expect(producerIncome({ ...franchise, martsOwned: 3 }, HELPING_HAND)).toBeCloseTo(0.11)
  })
})

describe('incomePerSecond', () => {
  const franchise = initialState()

  it('is sales per second times the sale value, with the franchise bonus', () => {
    const grown = {
      ...franchise,
      martsOwned: 2,
      producers: { ...emptyProducers(), helpingHand: 10 },
    }

    expect(incomePerSecond(grown)).toBeCloseTo(1.05)
  })

  it('grows with stocked items', () => {
    const stocked = {
      ...franchise,
      producers: { ...emptyProducers(), helpingHand: 10 },
      stockedItems: ['antidote' as const],
    }

    expect(incomePerSecond(stocked)).toBeCloseTo(1.1)
  })

  it('is zero with no producers', () => {
    expect(incomePerSecond({ ...franchise, martsOwned: 11 })).toBe(0)
  })
})

describe('franchiseBonus', () => {
  it('splits the bonus by source, leaving out register upgrades', () => {
    const franchise = initialState()
    const grown = {
      ...franchise,
      martsOwned: 3,
      registerUpgrades: ['secondTill' as const],
      achievements: { ...franchise.achievements, customersServed: 2, idleHands: 1 },
    }

    expect(franchiseBonus(grown)).toEqual({
      extraLocations: 2,
      achievementTiers: 3,
      fromLocations: 0.1,
      fromAchievements: 0.03,
      total: 0.13,
    })
  })
})

describe('franchiseMultiplier', () => {
  const franchise = initialState()

  it.each([
    [1, 1],
    [2, 1.05],
    [11, 1.5],
  ])('with %i locations is %d', (martsOwned, expected) => {
    expect(franchiseMultiplier({ ...franchise, martsOwned })).toBeCloseTo(expected)
  })

  it('ignores register upgrades', () => {
    expect(
      franchiseMultiplier({ ...franchise, registerUpgrades: ['secondTill', 'meowthCoinCounter'] }),
    ).toBe(1)
  })

  it('adds +1% per achievement tier', () => {
    const achieved = {
      ...franchise,
      achievements: { ...franchise.achievements, totalEarned: 3, idleHands: 1 },
    }

    expect(franchiseMultiplier(achieved)).toBeCloseTo(1.04)
  })
})

describe('clickIncomeShare', () => {
  it.each([
    [[], 0.01],
    [['secondTill'], 0.06],
    [['secondTill', 'meowthCoinCounter', 'machopBagger'], 0.16],
  ] as const)('with %j is %d', (upgrades, expected) => {
    expect(clickIncomeShare([...upgrades])).toBeCloseTo(expected)
  })
})

describe('clickSaleMultiplier', () => {
  it.each([
    [[], 1],
    [['secondTill'], 2],
    [['secondTill', 'meowthCoinCounter', 'machopBagger'], 8],
  ] as const)('with %j is ×%i', (upgrades, expected) => {
    expect(clickSaleMultiplier([...upgrades])).toBe(expected)
  })
})

describe('clickValue', () => {
  const franchise = initialState()
  const bikes = { ...emptyProducers(), deliveryBike: 10 }

  it('is ₽1 for a new franchise', () => {
    expect(clickValue(franchise)).toBe(1)
  })

  it('adds 1% of income per second', () => {
    expect(clickValue({ ...franchise, producers: bikes })).toBeCloseTo(1 + 0.01 * 10)
  })

  it('doubles the sale and adds 5% of income per register upgrade', () => {
    const upgraded = { ...franchise, producers: bikes, registerUpgrades: ['secondTill' as const] }

    expect(clickValue(upgraded)).toBeCloseTo(2 + 0.06 * 10)
  })

  it('goes from ₽1 to ₽8 a click with three register upgrades and no income', () => {
    const upgraded = {
      ...franchise,
      registerUpgrades: [
        'secondTill' as const,
        'meowthCoinCounter' as const,
        'machopBagger' as const,
      ],
    }

    expect(clickValue(upgraded)).toBe(8)
  })

  it('applies the franchise bonus to the sale', () => {
    expect(clickValue({ ...franchise, martsOwned: 2 })).toBeCloseTo(1.05)
  })

  it('starts from the stocked sale value', () => {
    expect(clickValue({ ...franchise, stockedItems: ['antidote'] })).toBeCloseTo(1.1)
  })
})

describe('openRequirements', () => {
  const franchise = initialState()
  const busy = { ...franchise, producers: { ...emptyProducers(), deliveryBike: 5 } }

  it('is ready for Viridian with ₽5/s and ₽1,000', () => {
    expect(openRequirements(busy, 1_000)).toMatchObject({
      location: { id: 'viridian' },
      hasCoins: true,
      hasIncome: true,
      ready: true,
    })
  })

  it.each([
    [17, 142.8, false],
    [18, 151.2, true],
  ])('with %i Vending Machines (₽%s/s) Pewter ready is %s', (machines, _, expected) => {
    const viridian = {
      ...franchise,
      martsOwned: 2,
      producers: { ...emptyProducers(), vendingMachine: machines },
    }

    expect(openRequirements(viridian, 20_000)).toMatchObject({
      location: { id: 'pewter' },
      ready: expected,
    })
  })

  it.each([
    ['coins', busy, 999],
    ['income', franchise, 1e9],
  ])('is not ready without enough %s', (_, state, coins) => {
    expect(openRequirements(state, coins)?.ready).toBe(false)
  })

  it('is undefined once every playable location is open', () => {
    expect(openRequirements({ ...franchise, martsOwned: PLAYABLE_LOCATIONS }, 1e9)).toBeUndefined()
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

  it.each([
    [60.75, '₽61'],
    [115, '₽115'],
    [1_400_000, '₽1.40M'],
  ])('prices %d as %s', (cost, expected) => {
    expect(formatPrice(cost)).toBe(expected)
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
