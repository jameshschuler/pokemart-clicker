import { beforeEach, describe, expect, it } from 'vitest'
import { debugCommands } from './debug'
import { emptyProducers, initialState, useGame } from './store'

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
    [undefined, 2],
    [2, 2],
    [0, 1],
    [99, 2],
  ])('openMarts(%s) owns %i marts', (count, expected) => {
    debugCommands.openMarts(count)

    expect(useGame.getState().martsOwned).toBe(expected)
  })

  it('away pays the time in full and opens the report', () => {
    useGame.setState({ producers: { ...emptyProducers(), flyer: 10 } })

    debugCommands.away(1200)

    expect(useGame.getState()).toMatchObject({ coins: 1200, awayReport: { seconds: 1200 } })
  })
})
