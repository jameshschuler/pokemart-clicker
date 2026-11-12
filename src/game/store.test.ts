import { beforeEach, describe, expect, it } from 'vitest'
import { ITEMS } from './items'
import { emptyShelves, initialState, useGame } from './store'

beforeEach(() => {
  useGame.setState(initialState())
})

function stockPallet(potions: number) {
  const state = useGame.getState()
  useGame.setState({ marts: { ...state.marts, pallet: { ...emptyShelves(), potion: potions } } })
}

describe('openNextTown', () => {
  it('opens Viridian, charges its cost and switches to it', () => {
    stockPallet(15)
    useGame.setState({ coins: 200 })

    useGame.getState().openNextTown()

    expect(useGame.getState()).toMatchObject({ martsOwned: 2, coins: 20, selectedMart: 'viridian' })
  })

  it('needs enough chain sales, not just coins', () => {
    stockPallet(14)
    useGame.setState({ coins: 10_000 })

    useGame.getState().openNextTown()

    expect(useGame.getState()).toMatchObject({ martsOwned: 1, coins: 10_000 })
  })

  it('needs enough coins, not just sales', () => {
    stockPallet(15)
    useGame.setState({ coins: 179 })

    useGame.getState().openNextTown()

    expect(useGame.getState().martsOwned).toBe(1)
  })

  it('needs every shelf in the newest mart stocked', () => {
    stockPallet(100)
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
  it('stocks only the chosen mart', () => {
    useGame.setState({ coins: 1_000, martsOwned: 2 })

    useGame.getState().buyItem('viridian', 'potion', 1)

    const { marts, coins } = useGame.getState()
    expect(marts.viridian.potion).toBe(1)
    expect(marts.pallet.potion).toBe(0)
    expect(coins).toBe(985)
  })

  it('prices each mart separately', () => {
    stockPallet(20)
    useGame.setState({ coins: 1_000, martsOwned: 2 })

    useGame.getState().buyItem('viridian', 'potion', 1)

    expect(useGame.getState().coins).toBe(985)
  })

  it('refuses marts that are not open', () => {
    useGame.setState({ coins: 1_000 })

    useGame.getState().buyItem('viridian', 'pokeBall', 1)

    expect(useGame.getState().coins).toBe(1_000)
  })

  it('refuses a full shelf', () => {
    stockPallet(100)
    useGame.setState({ coins: 1e30 })

    useGame.getState().buyItem('pallet', 'potion', 1)

    expect(useGame.getState()).toMatchObject({ coins: 1e30, marts: { pallet: { potion: 100 } } })
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

  it('counts items stocked and money spent', () => {
    useGame.setState({ coins: 1_000 })

    useGame.getState().buyItem('pallet', 'potion', 10)
    useGame.getState().buyRegisterUpgrade('secondTill')

    const { stats, coins } = useGame.getState()
    expect(stats.itemsStocked).toBe(10)
    expect(stats.totalSpent).toBeCloseTo(1_000 - coins)
  })

  it('ignores refused purchases', () => {
    useGame.getState().buyItem('pallet', 'potion', 1)

    expect(useGame.getState().stats).toMatchObject({ itemsStocked: 0, totalSpent: 0 })
  })

  it('counts play time and shelf earnings', () => {
    stockPallet(10)

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
  it('pays every mart with mart and restock bonuses', () => {
    const { marts } = useGame.getState()
    useGame.setState({
      martsOwned: 3,
      marts: {
        ...marts,
        pallet: { ...emptyShelves(), potion: 10 },
        viridian: { ...emptyShelves(), pokeBall: 10 },
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
    stockPallet(9)
    const before = useGame.getState().coins
    useGame.setState((state) => ({ stats: { ...state.stats, clicks: 100 } }))

    useGame.getState().tick(0)
    useGame.getState().tick(1)

    expect(useGame.getState().achievements.customersServed).toBe(1)
    expect(useGame.getState().coins - before).toBeCloseTo(9 * ITEMS[0].salesPerSecond * 1.01)
  })
})

describe('tick across a gap', () => {
  it('pays the first minute at full rate and the rest at half rate', () => {
    stockPallet(9)

    useGame.getState().tick(600)

    expect(useGame.getState()).toMatchObject({
      coins: 297,
      stats: { salesEarnings: 54, awayEarnings: 243, playSeconds: 60 },
      awayReport: { seconds: 540, earned: 243 },
    })
  })

  it('never pays less for a longer gap', () => {
    stockPallet(9)
    useGame.getState().tick(59)
    const shorter = useGame.getState().coins
    useGame.setState({ coins: 0 })

    useGame.getState().tick(61)

    expect(useGame.getState().coins).toBeGreaterThan(shorter)
  })

  it.each([
    ['a gap under a minute', 9, 60],
    ['empty shelves', 0, 3600],
  ])('shows no welcome back report for %s', (_, potions, seconds) => {
    stockPallet(potions)

    useGame.getState().tick(seconds)

    expect(useGame.getState().awayReport).toBeUndefined()
  })

  it('clears the report when dismissed', () => {
    stockPallet(9)
    useGame.getState().tick(600)

    useGame.getState().dismissAwayReport()

    expect(useGame.getState().awayReport).toBeUndefined()
  })
})

describe('advanceTo', () => {
  it('pays for the wall-clock time since sales were last paid', () => {
    stockPallet(9)
    useGame.setState({ paidUntil: 1_000 })

    useGame.getState().advanceTo(601_000)

    expect(useGame.getState()).toMatchObject({ coins: 297, paidUntil: 601_000 })
  })

  it('pays nothing when the clock goes backwards', () => {
    stockPallet(9)
    useGame.setState({ paidUntil: 1_000 })

    useGame.getState().advanceTo(500)

    expect(useGame.getState()).toMatchObject({ coins: 0, paidUntil: 500 })
  })
})
