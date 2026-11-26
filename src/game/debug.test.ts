import { beforeEach, describe, expect, it } from 'vitest'
import { debugCommands } from './debug'
import { PLAYABLE_LOCATIONS } from './locations'
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
    [undefined, PLAYABLE_LOCATIONS],
    [2, 2],
    [0, 1],
    [99, PLAYABLE_LOCATIONS],
  ])('openMarts(%s) owns %i marts', (count, expected) => {
    debugCommands.openMarts(count)

    expect(useGame.getState().martsOwned).toBe(expected)
  })

  it.each([
    [2, 2],
    [0, 1],
    [9, 4],
  ])('openFloors(%i) opens %i floors', (count, expected) => {
    useGame.setState({ martsOwned: 7 })

    debugCommands.openFloors(count)

    expect(useGame.getState().floorsOpen).toBe(expected)
  })

  it('openFloors does nothing before Celadon opens', () => {
    debugCommands.openFloors(3)

    expect(useGame.getState().floorsOpen).toBe(1)
  })

  it('closing Celadon closes its floors and loses Eevee', () => {
    useGame.setState({ martsOwned: 7, floorsOpen: 4, eevee: 'eevee' })

    debugCommands.openMarts(6)

    expect(useGame.getState()).toMatchObject({ martsOwned: 6, floorsOpen: 1, eevee: null })
  })

  it('away pays the time in full and opens the report', () => {
    useGame.setState({ producers: { ...emptyProducers(), helpingHand: 10 } })

    debugCommands.away(1200)

    expect(useGame.getState()).toMatchObject({ coins: 1200, awayReport: { seconds: 1200 } })
  })
})
