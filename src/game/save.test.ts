import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PLAYABLE_LOCATIONS } from './locations'
import { loadGame } from './save'
import { emptyProducers, initialState, useGame } from './store'

function storeSave(state: object, savedAt: number | undefined = Date.now(), version = 5) {
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
  it.each([
    ['before the franchise', 3],
    ['before the producers were renamed', 4],
  ])('starts fresh from a save made %s', (_, version) => {
    storeSave({ ...initialState(), coins: 5_000 }, Date.now(), version)

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
    ['too many marts', { martsOwned: 40 }, { martsOwned: PLAYABLE_LOCATIONS }],
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
  ])('loads %s of helping hands as %s', (_, saved, expected) => {
    storeSave({ ...initialState(), producers: { helpingHand: saved, clerk: 9 } })

    loadGame()

    expect(useGame.getState().producers).toEqual({ ...emptyProducers(), helpingHand: expected })
  })

  it.each([
    ['items that no longer exist', 2, ['antidote', 'rareCandy'], ['antidote']],
    ['items from a location not open yet', 1, ['antidote', 'hpUp'], []],
    ['the same item twice', 2, ['antidote', 'antidote'], ['antidote']],
    ['a list that is not a list', 2, 'antidote', []],
  ])('drops %s from stocked items', (_, martsOwned, stockedItems, expected) => {
    storeSave({ ...initialState(), martsOwned, stockedItems })

    loadGame()

    expect(useGame.getState().stockedItems).toEqual(expected)
  })

  it.each([
    ['upgrades from a location not open yet', 1, ['secondTill', 'machopBagger'], ['secondTill']],
    ['upgrades that no longer exist', 1, ['secondTill', 'goldCard'], ['secondTill']],
    ['the same upgrade twice', 1, ['secondTill', 'secondTill'], ['secondTill']],
    ['a list that is not a list', 1, 'secondTill', []],
  ])('drops %s from register upgrades', (_, martsOwned, registerUpgrades, expected) => {
    storeSave({ ...initialState(), martsOwned, registerUpgrades })

    loadGame()

    expect(useGame.getState().registerUpgrades).toEqual(expected)
  })

  it('starts with nothing stocked for a save from before stocking', () => {
    const { stockedItems: _, ...older } = initialState()
    storeSave(older)

    loadGame()

    expect(useGame.getState().stockedItems).toEqual([])
  })
})

describe('loadGame offline earnings', () => {
  const NOW = 1_000_000

  function sellingPallet(paidUntil?: number) {
    const state = initialState()

    return {
      ...state,
      paidUntil,
      producers: { ...emptyProducers(), helpingHand: 10 },
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
