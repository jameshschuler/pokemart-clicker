import { describe, expect, it } from 'vitest'
import {
  bulkCost,
  chainBonus,
  chainMultiplier,
  chainSalesPerSecond,
  clickValue,
  isStocked,
  maxAffordable,
  openRequirements,
  purchaseQuote,
  milestoneLevel,
  martSales,
} from './economy'
import { formatDuration, formatMoney, formatPercent, formatRate, formatWholeMoney } from './format'
import { ITEMS, type ItemId } from './items'
import { emptyOrders, initialState } from './store'

const RATES = new Map(ITEMS.map((item) => [item.id, item.salesPerSecond]))

function rate(itemId: ItemId): number {
  return RATES.get(itemId) ?? 0
}

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

describe('milestoneLevel', () => {
  const stock = ['potion', 'antidote'] as const

  it.each([
    [0, 50, 0],
    [9, 50, 0],
    [10, 10, 1],
    [25, 49, 2],
    [100, 100, 4],
  ])('with %i and %i units → level %i', (potions, antidotes, expected) => {
    const orders = { ...emptyOrders(), potion: potions, antidote: antidotes }

    expect(milestoneLevel(orders, [...stock])).toBe(expected)
  })
})

describe('martSales', () => {
  it('sums one mart', () => {
    expect(martSales({ ...emptyOrders(), potion: 10, pokeBall: 2 })).toBeCloseTo(
      10 * rate('potion') + 2 * rate('pokeBall'),
    )
  })

  it('is zero with no orders', () => {
    expect(martSales(emptyOrders())).toBe(0)
  })
})

describe('chainSalesPerSecond', () => {
  const chain = initialState()
  const ordered = {
    ...chain,
    marts: {
      ...chain.marts,
      pallet: { ...emptyOrders(), potion: 10 },
      viridian: { ...emptyOrders(), potion: 5, pokeBall: 2 },
    },
  }

  const base = 15 * rate('potion') + 2 * rate('pokeBall')

  it('sums every mart', () => {
    expect(chainSalesPerSecond(ordered)).toBeCloseTo(base * 1.05)
  })

  it('applies the mart bonus on top', () => {
    expect(chainSalesPerSecond({ ...ordered, martsOwned: 3 })).toBeCloseTo(base * 1.15)
  })

  it('is zero with nothing ordered', () => {
    expect(chainSalesPerSecond({ ...chain, martsOwned: 11 })).toBe(0)
  })
})

describe('chainBonus', () => {
  it('splits the bonus by source', () => {
    const chain = initialState()
    const atMilestone = {
      marts: { ...chain.marts, pallet: { ...emptyOrders(), potion: 25 } },
      martsOwned: 3,
      achievements: { ...chain.achievements, customersServed: 2, idleHands: 1 },
    }

    expect(chainBonus(atMilestone)).toEqual({
      extraMarts: 2,
      milestones: 2,
      achievementTiers: 3,
      fromMarts: 0.1,
      fromMilestones: 0.1,
      fromAchievements: 0.03,
    })
  })
})

describe('chainMultiplier', () => {
  const chain = initialState()

  it.each([
    [1, 1],
    [2, 1.05],
    [11, 1.5],
  ])('with %i marts and no milestones is %d', (martsOwned, expected) => {
    expect(chainMultiplier({ ...chain, martsOwned })).toBeCloseTo(expected)
  })

  it('adds +5% per order milestone', () => {
    const atMilestone = {
      ...chain,
      marts: { ...chain.marts, pallet: { ...emptyOrders(), potion: 25 } },
    }

    expect(chainMultiplier(atMilestone)).toBeCloseTo(1.1)
  })

  it('adds +1% per achievement tier', () => {
    const achieved = {
      ...chain,
      achievements: { ...chain.achievements, totalEarned: 3, martsOpened: 1 },
    }

    expect(chainMultiplier(achieved)).toBeCloseTo(1.04)
  })
})

describe('openRequirements', () => {
  const chain = initialState()
  const palletOrdered = {
    ...chain,
    marts: { ...chain.marts, pallet: { ...emptyOrders(), potion: 15 } },
  }

  it('is ready with coins, sales and every item ordered in the newest mart', () => {
    expect(openRequirements(palletOrdered, 180)).toMatchObject({
      town: { id: 'viridian' },
      hasCoins: true,
      hasSales: true,
      missing: [],
      ready: true,
    })
  })

  it.each([
    ['coins', 15, 179],
    ['sales', 14, 1e9],
  ])('is not ready without enough %s', (_, potions, coins) => {
    const pallet = {
      ...chain,
      marts: { ...chain.marts, pallet: { ...emptyOrders(), potion: potions } },
    }

    expect(openRequirements(pallet, coins)?.ready).toBe(false)
  })

  it('lists items the newest mart does not order yet', () => {
    const viridianPartly = {
      ...palletOrdered,
      martsOwned: 2,
      marts: { ...palletOrdered.marts, viridian: { ...emptyOrders(), potion: 1, antidote: 1 } },
    }

    expect(openRequirements(viridianPartly, 1e9)).toMatchObject({
      town: { id: 'pewter' },
      missing: ['pokeBall', 'paralyzeHeal'],
      ready: false,
    })
  })

  it('is undefined once every mart is open', () => {
    expect(openRequirements({ ...chain, martsOwned: 11 }, 1e30)).toBeUndefined()
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
  ] as const)('with %j at ₽%d/s is ₽%d', (upgrades, salesPerSecond, expected) => {
    expect(clickValue([...upgrades], salesPerSecond)).toBeCloseTo(expected)
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

describe('isStocked', () => {
  it.each([
    [{ potion: 25 }, ['potion'], true],
    [{ potion: 24 }, ['potion'], false],
    [{ potion: 100, antidote: 25 }, ['potion', 'antidote'], true],
    [{ potion: 100, antidote: 0 }, ['potion', 'antidote'], false],
  ] as const)('%j selling %j is %s', (orders, stock, expected) => {
    expect(isStocked({ ...emptyOrders(), ...orders }, [...stock])).toBe(expected)
  })
})
