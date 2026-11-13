import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadGame } from './save'
import { initialState, useGame } from './store'

function storeSave(state: object, savedAt: number | undefined = Date.now()) {
  const storage = new Map([['mart-clicker:save', JSON.stringify({ version: 2, savedAt, state })]])
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
  })
}

beforeEach(() => {
  useGame.setState(initialState())
})

afterEach(() => {
  vi.useRealTimers()
})

describe('loadGame achievements', () => {
  it('starts a save from before achievements with none earned', () => {
    const { achievements: _, ...older } = initialState()
    storeSave({ ...older, coins: 50 })

    loadGame()

    expect(useGame.getState()).toMatchObject({
      coins: 50,
      achievements: initialState().achievements,
    })
  })

  it('keeps earned tiers and drops achievements that no longer exist', () => {
    const state = initialState()
    storeSave({
      ...state,
      achievements: { ...state.achievements, customersServed: 2, retired: 1 },
    })

    loadGame()

    expect(useGame.getState().achievements).toEqual({
      ...state.achievements,
      customersServed: 2,
    })
  })
})

describe('loadGame repairs bad values', () => {
  it.each([
    ['too few marts', { martsOwned: 0 }, { martsOwned: 1 }],
    ['too many marts', { martsOwned: 40 }, { martsOwned: 11 }],
    ['a town that no longer exists', { selectedMart: 'route1' }, { selectedMart: 'pallet' }],
    [
      'a town not yet opened',
      { martsOwned: 2, selectedMart: 'pewter' },
      { selectedMart: 'pallet' },
    ],
    ['negative coins', { coins: -50 }, { coins: 0 }],
    ['non-numeric coins', { coins: 'lots' }, { coins: 0 }],
  ])('fixes %s', (_, saved, expected) => {
    storeSave({ ...initialState(), ...saved })

    loadGame()

    expect(useGame.getState()).toMatchObject(expected)
  })

  it('keeps orders past 100 a day', () => {
    const state = initialState()
    storeSave({
      ...state,
      marts: { ...state.marts, pallet: { ...state.marts.pallet, potion: 120 } },
    })

    loadGame()

    expect(useGame.getState().marts.pallet.potion).toBe(120)
  })

  it('carries items stocked over to units ordered', () => {
    const state = initialState()
    const { unitsOrdered: _, ...oldStats } = state.stats
    storeSave({ ...state, stats: { ...oldStats, itemsStocked: 42 } })

    loadGame()

    expect(useGame.getState().stats.unitsOrdered).toBe(42)
    expect(useGame.getState().stats).not.toHaveProperty('itemsStocked')
  })
})

describe('loadGame offline earnings', () => {
  const NOW = 1_000_000

  function sellingPallet(paidUntil?: number) {
    const state = initialState()

    return {
      ...state,
      paidUntil,
      marts: { ...state.marts, pallet: { ...state.marts.pallet, potion: 9 } },
    }
  }

  it('pays for the time since sales were last paid', () => {
    vi.useFakeTimers({ now: NOW })
    storeSave(sellingPallet(NOW - 600_000), NOW)

    loadGame()

    expect(useGame.getState()).toMatchObject({ coins: 540, paidUntil: NOW })
  })

  it('falls back to the save time for saves from before paidUntil', () => {
    vi.useFakeTimers({ now: NOW })
    storeSave(sellingPallet(), NOW - 600_000)

    loadGame()

    expect(useGame.getState().coins).toBeCloseTo(540)
  })

  it.each([
    ['a save from the future', NOW + 600_000],
    ['a save with no timestamp', undefined],
  ])('pays nothing for %s', (_, savedAt) => {
    vi.useFakeTimers({ now: NOW })
    storeSave(sellingPallet(), savedAt)

    loadGame()

    expect(useGame.getState()).toMatchObject({ coins: 0, awayReport: undefined })
  })
})
