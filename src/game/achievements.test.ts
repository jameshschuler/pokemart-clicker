import { describe, expect, it } from 'vitest'
import {
  ACHIEVEMENTS,
  checkAchievements,
  tiersReached,
  TOTAL_ACHIEVEMENT_TIERS,
} from './achievements'
import { emptyProducers, initialState } from './store'

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
    expect(TOTAL_ACHIEVEMENT_TIERS).toBe(11)
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
      producers: { ...emptyProducers(), flyer: 1 },
      stats: { ...base.stats, clicks: 1_500 },
    }

    expect(checkAchievements(state)).toMatchObject({
      customersServed: 2,
      flyersPosted: 1,
      totalEarned: 0,
    })
  })

  it('never takes back an earned tier', () => {
    const base = initialState()
    const state = {
      ...base,
      achievements: { ...base.achievements, customersServed: 3 },
    }

    expect(checkAchievements(state).customersServed).toBe(3)
  })
})

describe('flyers posted', () => {
  it.each([
    [0, 0],
    [1, 1],
    [10, 2],
    [25, 3],
  ])('with %i flyers is %i tiers', (flyer, expected) => {
    const base = initialState()

    expect(
      checkAchievements({ ...base, producers: { ...emptyProducers(), flyer } }).flyersPosted,
    ).toBe(expected)
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
