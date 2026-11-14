import { beforeEach, describe, expect, it } from 'vitest'
import { emptyProducers, initialState, useGame } from './store'

beforeEach(() => {
  useGame.setState(initialState())
})

/** Each flyer earns ₽0.1/s: a ₽1 sale every 10 seconds. */
function postFlyers(flyers: number) {
  useGame.setState({ producers: { ...emptyProducers(), flyer: flyers } })
}

describe('serveCustomer', () => {
  it('earns one sale per click', () => {
    expect(useGame.getState().serveCustomer()).toBe(1)
    expect(useGame.getState().coins).toBe(1)
  })

  it('earns the stocked sale value', () => {
    useGame.setState({ stockedItems: ['antidote', 'pokeBall'] })

    expect(useGame.getState().serveCustomer()).toBeCloseTo(1.3)
  })
})

describe('buyProducer', () => {
  it('buys a flyer', () => {
    useGame.setState({ coins: 100 })

    useGame.getState().buyProducer('flyer', 1)

    expect(useGame.getState()).toMatchObject({ coins: 85, producers: { flyer: 1 } })
  })

  it('raises the price 15% per purchase', () => {
    useGame.setState({ coins: 1e6 })

    useGame.getState().buyProducer('flyer', 10)

    expect(useGame.getState().coins).toBeCloseTo(1e6 - (15 * (1.15 ** 10 - 1)) / 0.15)
  })

  it('refuses without enough coins', () => {
    useGame.setState({ coins: 14 })

    useGame.getState().buyProducer('flyer', 1)

    expect(useGame.getState()).toMatchObject({ coins: 14, producers: { flyer: 0 } })
  })
})

describe('buyProducer town', () => {
  it('refuses a producer whose town is not open', () => {
    useGame.setState({ coins: 1e9 })

    useGame.getState().buyProducer('stockClerk', 1)

    expect(useGame.getState()).toMatchObject({
      coins: 1e9,
      producers: { stockClerk: 0 },
    })
  })

  it('sells it once the town opens', () => {
    useGame.setState({ coins: 1e9, martsOwned: 2 })

    useGame.getState().buyProducer('stockClerk', 1)

    expect(useGame.getState().producers.stockClerk).toBe(1)
  })
})

describe('openNextTown', () => {
  function readyForViridian(coins: number) {
    useGame.setState({ coins, producers: { ...emptyProducers(), deliveryBike: 5 } })
  }

  it('opens Viridian and charges its cost', () => {
    readyForViridian(1_200)

    useGame.getState().openNextTown()

    expect(useGame.getState()).toMatchObject({ martsOwned: 2, coins: 200 })
  })

  it('refuses without enough income', () => {
    useGame.setState({ coins: 1e9 })

    useGame.getState().openNextTown()

    expect(useGame.getState()).toMatchObject({ martsOwned: 1, coins: 1e9 })
  })

  it('refuses without enough coins', () => {
    readyForViridian(999)

    useGame.getState().openNextTown()

    expect(useGame.getState().martsOwned).toBe(1)
  })

  it('stops at the last playable town', () => {
    readyForViridian(1e9)
    useGame.setState({ martsOwned: 2 })

    useGame.getState().openNextTown()

    expect(useGame.getState().martsOwned).toBe(2)
  })
})

describe('stockItem', () => {
  it('stocks an item from an open town and raises the sale value', () => {
    useGame.setState({ coins: 2_000, martsOwned: 2 })

    useGame.getState().stockItem('antidote')

    expect(useGame.getState()).toMatchObject({ coins: 500, stockedItems: ['antidote'] })
  })

  it.each([
    ['from a town not yet open', 1e9, 1, [], 'antidote'],
    ['already stocked', 1e9, 2, ['antidote'], 'antidote'],
    ['without enough coins', 1_499, 2, [], 'antidote'],
    ['that is the starting item', 1e9, 2, [], 'potion'],
  ] as const)('refuses an item %s', (_, coins, martsOwned, stockedItems, itemId) => {
    useGame.setState({ coins, martsOwned, stockedItems: [...stockedItems] })

    useGame.getState().stockItem(itemId)

    expect(useGame.getState().coins).toBe(coins)
  })
})

describe('buyRegisterUpgrade', () => {
  it('buys an unlocked upgrade and raises the click value', () => {
    useGame.setState({ coins: 150 })

    useGame.getState().buyRegisterUpgrade('secondTill')
    const earned = useGame.getState().serveCustomer()

    expect(useGame.getState()).toMatchObject({ coins: 52, registerUpgrades: ['secondTill'] })
    expect(earned).toBe(2)
  })

  it('refuses an upgrade out of order', () => {
    useGame.setState({ coins: 1e9 })

    useGame.getState().buyRegisterUpgrade('machopBagger')

    expect(useGame.getState()).toMatchObject({ coins: 1e9, registerUpgrades: [] })
  })

  it('refuses buying the same upgrade twice', () => {
    useGame.setState({ coins: 1e9, registerUpgrades: ['secondTill'] })

    useGame.getState().buyRegisterUpgrade('secondTill')

    expect(useGame.getState()).toMatchObject({ coins: 1e9, registerUpgrades: ['secondTill'] })
  })

  it('refuses without enough coins', () => {
    useGame.setState({ coins: 99 })

    useGame.getState().buyRegisterUpgrade('secondTill')

    expect(useGame.getState().registerUpgrades).toEqual([])
  })
})

describe('lifetime stats', () => {
  it('counts clicks and click earnings', () => {
    useGame.getState().serveCustomer()
    useGame.getState().serveCustomer()

    expect(useGame.getState().stats).toMatchObject({ clicks: 2, clickEarnings: 2 })
  })

  it('counts money spent', () => {
    useGame.setState({ coins: 1e6 })

    useGame.getState().buyProducer('flyer', 10)
    useGame.getState().buyRegisterUpgrade('secondTill')

    const { stats, coins } = useGame.getState()
    expect(stats.totalSpent).toBeCloseTo(1e6 - coins)
  })

  it('ignores refused purchases', () => {
    useGame.getState().buyProducer('flyer', 1)

    expect(useGame.getState().stats.totalSpent).toBe(0)
  })

  it('counts play time and sales earnings', () => {
    postFlyers(10)

    useGame.getState().tick(3)

    expect(useGame.getState().stats).toMatchObject({ playSeconds: 3, salesEarnings: 3 })
  })
})

describe('tick', () => {
  it('pays sales with the franchise bonus', () => {
    useGame.setState({ martsOwned: 3, producers: { ...emptyProducers(), flyer: 10 } })

    useGame.getState().tick(2)

    expect(useGame.getState().coins).toBeCloseTo(1 * 1.1 * 2)
  })
})

describe('achievements', () => {
  it('are earned on the next tick and boost sales', () => {
    postFlyers(1)
    useGame.setState((state) => ({ stats: { ...state.stats, clicks: 100 } }))

    useGame.getState().tick(0)
    const before = useGame.getState().coins
    useGame.getState().tick(1)

    expect(useGame.getState().achievements).toMatchObject({ customersServed: 1, flyerOwned: 1 })
    expect(useGame.getState().coins - before).toBeCloseTo(0.1 * 1.02)
  })
})

describe('tick across a gap', () => {
  it('pays time away in full and reports it', () => {
    postFlyers(10)

    useGame.getState().tick(1200)

    expect(useGame.getState()).toMatchObject({
      coins: 1200,
      stats: { salesEarnings: 0, awayEarnings: 1200, playSeconds: 0 },
      awayReport: { seconds: 1200, earned: 1200 },
    })
  })

  it('stops paying at the offline cap', () => {
    postFlyers(10)

    useGame.getState().tick(5 * 3600)

    expect(useGame.getState()).toMatchObject({
      coins: 2 * 3600,
      awayReport: { seconds: 2 * 3600 },
    })
  })

  it('counts a gap under 15 minutes as play, with no report', () => {
    postFlyers(10)

    useGame.getState().tick(899)

    expect(useGame.getState()).toMatchObject({
      stats: { awayEarnings: 0, playSeconds: 899 },
      awayReport: undefined,
    })
  })

  it('shows no report when nobody was working', () => {
    useGame.getState().tick(3600)

    expect(useGame.getState().awayReport).toBeUndefined()
  })

  it('clears the report when dismissed', () => {
    postFlyers(10)
    useGame.getState().tick(1200)

    useGame.getState().dismissAwayReport()

    expect(useGame.getState().awayReport).toBeUndefined()
  })
})

describe('advanceTo', () => {
  it('pays for the wall-clock time since sales were last paid', () => {
    postFlyers(10)
    useGame.setState({ paidUntil: 1_000 })

    useGame.getState().advanceTo(601_000)

    expect(useGame.getState()).toMatchObject({ coins: 600, paidUntil: 601_000 })
  })

  it('pays nothing when the clock goes backwards', () => {
    postFlyers(10)
    useGame.setState({ paidUntil: 1_000 })

    useGame.getState().advanceTo(500)

    expect(useGame.getState()).toMatchObject({ coins: 0, paidUntil: 500 })
  })
})
