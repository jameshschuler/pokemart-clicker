import { beforeEach, describe, expect, it } from 'vitest'
import { debugCommands } from './debug'
import { emptyOrders, initialState, useGame } from './store'

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

  it('away pays the time in full and opens the report', () => {
    useGame.setState((state) => ({
      marts: { ...state.marts, pallet: { ...emptyOrders(), potion: 5 } },
    }))

    debugCommands.away(1200)

    expect(useGame.getState()).toMatchObject({ coins: 600, awayReport: { seconds: 1200 } })
  })
})
