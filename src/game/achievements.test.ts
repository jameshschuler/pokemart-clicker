import { describe, expect, it } from 'vitest'
import {
  ACHIEVEMENTS,
  checkAchievements,
  tiersReached,
  TOTAL_ACHIEVEMENT_TIERS,
} from './achievements'
import { emptyOrders, initialState } from './store'

const CUSTOMERS = ACHIEVEMENTS.find((achievement) => achievement.id === 'customersServed')!

describe('achievement data', () => {
  it('has unique ids', () => {
    const ids = new Set(ACHIEVEMENTS.map((achievement) => achievement.id))

    expect(ids.size).toBe(ACHIEVEMENTS.length)
  })

  it('orders every tier by rising goal', () => {
    for (const achievement of ACHIEVEMENTS) {
      const goals = achievement.tiers.map((tier) => tier.goal)

      expect(goals).toEqual([...goals].sort((lower, higher) => lower - higher))
    }
  })

  it('counts every tier in the total', () => {
    expect(TOTAL_ACHIEVEMENT_TIERS).toBe(28)
  })
})

describe('tiersReached', () => {
  it.each([
    [0, 0],
    [99, 0],
    [100, 1],
    [9_999, 2],
    [10_000, 3],
    [1e9, 3],
  ])('at %i customers is %i tiers', (progress, expected) => {
    expect(tiersReached(CUSTOMERS, progress)).toBe(expected)
  })
})

describe('checkAchievements', () => {
  it('returns the same object when nothing new is earned', () => {
    const state = initialState()

    expect(checkAchievements(state)).toBe(state.achievements)
  })

  it('earns tiered and one-time achievements from game state', () => {
    const base = initialState()
    const state = {
      ...base,
      martsOwned: 3,
      marts: { ...base.marts, pallet: { ...emptyOrders(), potion: 25 } },
      stats: { ...base.stats, clicks: 1_500 },
    }

    expect(checkAchievements(state)).toMatchObject({
      customersServed: 2,
      martsOpened: 1,
      firstMilestone: 1,
      totalEarned: 0,
    })
  })

  it('never takes back an earned tier', () => {
    const base = initialState()
    const state = {
      ...base,
      achievements: { ...base.achievements, martsOpened: 3 },
    }

    expect(checkAchievements(state).martsOpened).toBe(3)
  })
})

describe('stocked achievements', () => {
  it('earns a town when every item it sells is ordered 25 a day, but not Kanto', () => {
    const base = initialState()
    const state = { ...base, marts: { ...base.marts, pallet: { ...emptyOrders(), potion: 25 } } }

    expect(checkAchievements(state)).toMatchObject({
      palletStocked: 1,
      viridianStocked: 0,
      kantoStocked: 0,
    })
  })

  it('does not earn a town with one order below 25', () => {
    const base = initialState()
    const viridian = {
      ...emptyOrders(),
      potion: 100,
      antidote: 25,
      pokeBall: 25,
      paralyzeHeal: 24,
    }
    const state = { ...base, marts: { ...base.marts, viridian } }

    expect(checkAchievements(state).viridianStocked).toBe(0)
  })

  it('earns Kanto when every mart is stocked', () => {
    const base = initialState()
    const full = Object.fromEntries(
      Object.keys(base.marts).map((townId) => [
        townId,
        Object.fromEntries(Object.keys(emptyOrders()).map((itemId) => [itemId, 25])),
      ]),
    ) as typeof base.marts

    expect(checkAchievements({ ...base, marts: full }).kantoStocked).toBe(1)
  })
})

describe('Idle Hands', () => {
  it.each([
    [999_999, 0],
    [1e6, 1],
  ])('with ₽%d earned while away is %i', (awayEarnings, expected) => {
    const base = initialState()

    expect(checkAchievements({ ...base, stats: { ...base.stats, awayEarnings } }).idleHands).toBe(
      expected,
    )
  })
})
