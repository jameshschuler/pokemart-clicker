import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadGame } from './save'
import { initialState, useGame } from './store'

function storeSave(state: object, savedAt: number | undefined = Date.now(), version = 4) {
  const storage = new Map([['mart-clicker:save', JSON.stringify({ version, savedAt, state })]])
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

describe('loadGame versions', () => {
  it('starts fresh from a save made before the franchise', () => {
    storeSave({ ...initialState(), coins: 5_000 }, Date.now(), 3)

    loadGame()

    expect(useGame.getState().coins).toBe(0)
  })
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
    ['negative coins', { coins: -50 }, { coins: 0 }],
    ['non-numeric coins', { coins: 'lots' }, { coins: 0 }],
  ])('fixes %s', (_, saved, expected) => {
    storeSave({ ...initialState(), ...saved })

    loadGame()

    expect(useGame.getState()).toMatchObject(expected)
  })

  it.each([
    ['a negative count', -3, 0],
    ['a non-numeric count', 'many', 0],
    ['a large count', 120, 120],
  ])('loads %s of flyers as %s', (_, saved, expected) => {
    storeSave({ ...initialState(), producers: { flyer: saved, clerk: 9 } })

    loadGame()

    expect(useGame.getState().producers).toEqual({ flyer: expected })
  })
})

describe('loadGame offline earnings', () => {
  const NOW = 1_000_000

  function sellingPallet(paidUntil?: number) {
    const state = initialState()

    return {
      ...state,
      paidUntil,
      producers: { flyer: 10 },
    }
  }

  it('pays for the time since sales were last paid', () => {
    vi.useFakeTimers({ now: NOW })
    storeSave(sellingPallet(NOW - 600_000), NOW)

    loadGame()

    expect(useGame.getState()).toMatchObject({ coins: 600, paidUntil: NOW })
  })

  it('falls back to the save time for saves from before paidUntil', () => {
    vi.useFakeTimers({ now: NOW })
    storeSave(sellingPallet(), NOW - 600_000)

    loadGame()

    expect(useGame.getState().coins).toBeCloseTo(600)
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
