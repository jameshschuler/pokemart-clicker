import { beforeEach, describe, expect, it } from 'vitest'
import { ITEMS } from './items'
import { emptyOrders, initialState, useGame } from './store'

beforeEach(() => {
  useGame.setState(initialState())
})

function orderPotions(potions: number) {
  const state = useGame.getState()
  useGame.setState({ marts: { ...state.marts, pallet: { ...emptyOrders(), potion: potions } } })
}

describe('openNextTown', () => {
  it('opens Viridian, charges its cost and switches to it', () => {
    orderPotions(15)
    useGame.setState({ coins: 200 })

    useGame.getState().openNextTown()

    expect(useGame.getState()).toMatchObject({ martsOwned: 2, coins: 20, selectedMart: 'viridian' })
  })

  it('needs enough chain sales, not just coins', () => {
    orderPotions(14)
    useGame.setState({ coins: 10_000 })

    useGame.getState().openNextTown()

    expect(useGame.getState()).toMatchObject({ martsOwned: 1, coins: 10_000 })
  })

  it('needs enough coins, not just sales', () => {
    orderPotions(15)
    useGame.setState({ coins: 179 })

    useGame.getState().openNextTown()

    expect(useGame.getState().martsOwned).toBe(1)
  })

  it('needs every item in the newest mart ordered', () => {
    orderPotions(100)
    useGame.setState({ coins: 1e9, martsOwned: 2 })

    useGame.getState().openNextTown()

    expect(useGame.getState()).toMatchObject({ martsOwned: 2, coins: 1e9 })
  })

  it('does nothing once every town is open', () => {
    useGame.setState({ coins: 1e20, martsOwned: 11 })

    useGame.getState().openNextTown()

    expect(useGame.getState()).toMatchObject({ martsOwned: 11, coins: 1e20 })
  })
})

describe('buyItem', () => {
  it('orders only for the chosen mart', () => {
    useGame.setState({ coins: 1_000, martsOwned: 2 })

    useGame.getState().buyItem('viridian', 'potion', 1)

    const { marts, coins } = useGame.getState()
    expect(marts.viridian.potion).toBe(1)
    expect(marts.pallet.potion).toBe(0)
    expect(coins).toBe(985)
  })

  it('prices each mart separately', () => {
    orderPotions(20)
    useGame.setState({ coins: 1_000, martsOwned: 2 })

    useGame.getState().buyItem('viridian', 'potion', 1)

    expect(useGame.getState().coins).toBe(985)
  })

  it('refuses marts that are not open', () => {
    useGame.setState({ coins: 1_000 })

    useGame.getState().buyItem('viridian', 'pokeBall', 1)

    expect(useGame.getState().coins).toBe(1_000)
  })

  it('grows an order past 100 a day', () => {
    orderPotions(100)
    useGame.setState({ coins: 1e30 })

    useGame.getState().buyItem('pallet', 'potion', 1)

    expect(useGame.getState().marts.pallet.potion).toBe(101)
  })

  it('refuses items the mart does not sell', () => {
    useGame.setState({ coins: 1_000 })

    useGame.getState().buyItem('pallet', 'pokeBall', 1)

    expect(useGame.getState().coins).toBe(1_000)
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

  it('refuses an upgrade whose town is not open', () => {
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

  it('counts units ordered and money spent', () => {
    useGame.setState({ coins: 1_000 })

    useGame.getState().buyItem('pallet', 'potion', 10)
    useGame.getState().buyRegisterUpgrade('secondTill')

    const { stats, coins } = useGame.getState()
    expect(stats.unitsOrdered).toBe(10)
    expect(stats.totalSpent).toBeCloseTo(1_000 - coins)
  })

  it('ignores refused purchases', () => {
    useGame.getState().buyItem('pallet', 'potion', 1)

    expect(useGame.getState().stats).toMatchObject({ unitsOrdered: 0, totalSpent: 0 })
  })

  it('counts play time and sales earnings', () => {
    orderPotions(10)

    useGame.getState().tick(3)

    expect(useGame.getState().stats.playSeconds).toBe(3)
    expect(useGame.getState().stats.salesEarnings).toBeCloseTo(useGame.getState().coins)
  })
})

describe('selectMart', () => {
  it('ignores marts that are not open', () => {
    useGame.getState().selectMart('celadon')

    expect(useGame.getState().selectedMart).toBe('pallet')
  })
})

describe('tick', () => {
  it('pays every mart with mart and milestone bonuses', () => {
    const { marts } = useGame.getState()
    useGame.setState({
      martsOwned: 3,
      marts: {
        ...marts,
        pallet: { ...emptyOrders(), potion: 10 },
        viridian: { ...emptyOrders(), pokeBall: 10 },
      },
    })

    useGame.getState().tick(2)

    const rates = new Map(ITEMS.map((item) => [item.id, item.salesPerSecond]))
    const perSecond = 10 * (rates.get('potion') ?? 0) + 10 * (rates.get('pokeBall') ?? 0)

    expect(useGame.getState().coins).toBeCloseTo(perSecond * 1.15 * 2)
  })
})

describe('achievements', () => {
  it('are earned on the next tick and boost sales', () => {
    orderPotions(9)
    const before = useGame.getState().coins
    useGame.setState((state) => ({ stats: { ...state.stats, clicks: 100 } }))

    useGame.getState().tick(0)
    useGame.getState().tick(1)

    expect(useGame.getState().achievements.customersServed).toBe(1)
    expect(useGame.getState().coins - before).toBeCloseTo(9 * ITEMS[0].salesPerSecond * 1.01)
  })
})

describe('Premier Balls', () => {
  function buyPokeBalls(amount: 1 | 10) {
    useGame.setState({ martsOwned: 2, coins: 1e9 })
    useGame.getState().buyItem('viridian', 'pokeBall', amount)
    useGame.getState().tick(0)
  }

  it('come free with 10 Poké Balls bought at once and earn Premier Customer', () => {
    buyPokeBalls(10)

    expect(useGame.getState()).toMatchObject({
      stats: { premierBalls: 1 },
      achievements: { premierCustomer: 1 },
    })
  })

  it('do not come with single Poké Balls', () => {
    buyPokeBalls(1)

    expect(useGame.getState()).toMatchObject({
      stats: { premierBalls: 0 },
      achievements: { premierCustomer: 0 },
    })
  })

  it('come with a Max purchase of 10 or more', () => {
    useGame.setState({ martsOwned: 2, coins: 1e9 })

    useGame.getState().buyItem('viridian', 'pokeBall', 'max')

    expect(useGame.getState().stats.premierBalls).toBe(1)
  })

  it('do not come with 10 of another item', () => {
    useGame.setState({ coins: 1e9 })
    useGame.getState().buyItem('pallet', 'potion', 10)

    expect(useGame.getState().stats.premierBalls).toBe(0)
  })
})

describe('tick across a gap', () => {
  it('pays time away in full and reports it', () => {
    orderPotions(9)

    useGame.getState().tick(1200)

    expect(useGame.getState()).toMatchObject({
      coins: 1080,
      stats: { salesEarnings: 0, awayEarnings: 1080, playSeconds: 0 },
      awayReport: { seconds: 1200, earned: 1080 },
    })
  })

  it('stops paying at the offline cap', () => {
    orderPotions(9)

    useGame.getState().tick(5 * 3600)

    expect(useGame.getState()).toMatchObject({
      coins: 0.9 * 2 * 3600,
      awayReport: { seconds: 2 * 3600 },
    })
  })

  it('counts a gap under 15 minutes as play, with no report', () => {
    orderPotions(9)

    useGame.getState().tick(899)

    expect(useGame.getState()).toMatchObject({
      stats: { awayEarnings: 0, playSeconds: 899 },
      awayReport: undefined,
    })
  })

  it('shows no report when nothing was ordered', () => {
    useGame.getState().tick(3600)

    expect(useGame.getState().awayReport).toBeUndefined()
  })

  it('clears the report when dismissed', () => {
    orderPotions(9)
    useGame.getState().tick(1200)

    useGame.getState().dismissAwayReport()

    expect(useGame.getState().awayReport).toBeUndefined()
  })
})

describe('advanceTo', () => {
  it('pays for the wall-clock time since sales were last paid', () => {
    orderPotions(9)
    useGame.setState({ paidUntil: 1_000 })

    useGame.getState().advanceTo(601_000)

    expect(useGame.getState()).toMatchObject({ coins: 540, paidUntil: 601_000 })
  })

  it('pays nothing when the clock goes backwards', () => {
    orderPotions(9)
    useGame.setState({ paidUntil: 1_000 })

    useGame.getState().advanceTo(500)

    expect(useGame.getState()).toMatchObject({ coins: 0, paidUntil: 500 })
  })
})
