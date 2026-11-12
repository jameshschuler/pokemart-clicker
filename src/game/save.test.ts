import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadGame } from './save'
import { initialState, useGame } from './store'

function storeSave(state: object) {
  const storage = new Map([
    ['mart-clicker:save', JSON.stringify({ version: 2, savedAt: 0, state })],
  ])
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
  })
}

beforeEach(() => {
  useGame.setState(initialState())
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

  it('caps shelves stocked past the shelf limit', () => {
    const state = initialState()
    storeSave({
      ...state,
      marts: { ...state.marts, pallet: { ...state.marts.pallet, potion: 120 } },
    })

    loadGame()

    expect(useGame.getState().marts.pallet.potion).toBe(100)
  })
})
