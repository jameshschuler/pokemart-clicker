import { beforeEach, describe, expect, it } from 'vitest'
import { debugCommands } from './debug'
import { emptyShelves, initialState, useGame } from './store'

beforeEach(() => {
  useGame.setState(initialState())
})

describe('debug commands', () => {
  it('adds money without counting it as earned', () => {
    debugCommands.addMoney(5_000)

    expect(useGame.getState()).toMatchObject({
      coins: 5_000,
      stats: { clickEarnings: 0, salesEarnings: 0 },
    })
  })

  it.each([
    [undefined, 11],
    [4, 4],
    [0, 1],
    [99, 11],
  ])('openMarts(%s) owns %i marts', (count, expected) => {
    debugCommands.openMarts(count)

    expect(useGame.getState().martsOwned).toBe(expected)
  })

  it('skip pays the shelves for the time skipped', () => {
    useGame.setState((state) => ({
      marts: { ...state.marts, pallet: { ...emptyShelves(), potion: 5 } },
    }))

    debugCommands.skip(60)

    expect(useGame.getState().coins).toBeCloseTo(5 * 0.1 * 60)
  })
})
