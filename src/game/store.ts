import { create } from 'zustand'
import { checkAchievements, emptyAchievements, type EarnedAchievements } from './achievements'
import {
  chainSalesPerSecond,
  clickValue,
  AWAY_SECONDS,
  OFFLINE_CAP_SECONDS,
  openRequirements,
  type AwayReport,
  purchaseQuote,
  type BuyAmount,
  type Marts,
  type Orders,
} from './economy'
import { ITEMS, type ItemId } from './items'
import { emptyStats, type LifetimeStats } from './stats'
import { isTownOpen, stocks, TOWNS, type TownId } from './towns'
import { REGISTER_UPGRADES, type RegisterUpgradeId } from './upgrades'

export interface GameState {
  coins: number
  marts: Marts
  martsOwned: number
  selectedMart: TownId
  registerUpgrades: RegisterUpgradeId[]
  stats: LifetimeStats
  achievements: EarnedAchievements
  /** Wall-clock ms that sales have been paid up to. */
  paidUntil: number
  /** Shown once after returning; never saved. */
  awayReport?: AwayReport
}

interface GameActions {
  serveCustomer: () => number
  buyItem: (townId: TownId, itemId: ItemId, amount: BuyAmount) => void
  openNextTown: () => void
  buyRegisterUpgrade: (upgradeId: RegisterUpgradeId) => void
  selectMart: (townId: TownId) => void
  tick: (seconds: number) => void
  advanceTo: (now: number) => void
  dismissAwayReport: () => void
  reset: () => void
}

const PREMIER_BALL_BULK = 10
const ITEM_BY_ID = new Map(ITEMS.map((item) => [item.id, item]))
const UPGRADE_BY_ID = new Map(REGISTER_UPGRADES.map((upgrade) => [upgrade.id, upgrade]))

export function emptyOrders(): Orders {
  return Object.fromEntries(ITEMS.map((item) => [item.id, 0])) as Orders
}

export function initialState(): GameState {
  return {
    coins: 0,
    marts: Object.fromEntries(TOWNS.map((town) => [town.id, emptyOrders()])) as Marts,
    martsOwned: 1,
    selectedMart: 'pallet',
    registerUpgrades: [],
    stats: emptyStats(Date.now()),
    achievements: emptyAchievements(),
    paidUntil: Date.now(),
    awayReport: undefined,
  }
}

function earnsPremierBall(itemId: ItemId, count: number): boolean {
  return itemId === 'pokeBall' && count >= PREMIER_BALL_BULK
}

function spend(state: GameState, cost: number): Pick<GameState, 'coins' | 'stats'> {
  return {
    coins: state.coins - cost,
    stats: { ...state.stats, totalSpent: state.stats.totalSpent + cost },
  }
}

export const useGame = create<GameState & GameActions>()((set, get) => ({
  ...initialState(),

  serveCustomer: () => {
    const earned = clickValue(get().registerUpgrades, chainSalesPerSecond(get()))
    set((state) => ({
      coins: state.coins + earned,
      stats: {
        ...state.stats,
        clicks: state.stats.clicks + 1,
        clickEarnings: state.stats.clickEarnings + earned,
      },
    }))

    return earned
  },

  buyItem: (townId, itemId, amount) => {
    const state = get()
    const { coins, marts, martsOwned } = state
    const item = ITEM_BY_ID.get(itemId)
    if (!item || !isTownOpen(townId, martsOwned) || !stocks(townId, itemId)) {
      return
    }

    const orders = marts[townId]
    const { count, cost } = purchaseQuote(item.baseCost, orders[itemId], coins, amount)
    if (cost > coins) {
      return
    }

    const spent = spend(state, cost)
    set({
      ...spent,
      marts: { ...marts, [townId]: { ...orders, [itemId]: orders[itemId] + count } },
      stats: {
        ...spent.stats,
        unitsOrdered: spent.stats.unitsOrdered + count,
        premierBalls: spent.stats.premierBalls + (earnsPremierBall(itemId, count) ? 1 : 0),
      },
    })
  },

  openNextTown: () => {
    const state = get()
    const { coins, martsOwned } = state
    const requirements = openRequirements(state, coins)
    if (!requirements?.ready) {
      return
    }

    const { town } = requirements
    set({ ...spend(state, town.openCost), martsOwned: martsOwned + 1, selectedMart: town.id })
  },

  buyRegisterUpgrade: (upgradeId) => {
    const state = get()
    const { coins, martsOwned, registerUpgrades } = state
    const upgrade = UPGRADE_BY_ID.get(upgradeId)
    if (
      !upgrade ||
      registerUpgrades.includes(upgradeId) ||
      !isTownOpen(upgrade.town, martsOwned) ||
      upgrade.cost > coins
    ) {
      return
    }

    set({ ...spend(state, upgrade.cost), registerUpgrades: [...registerUpgrades, upgradeId] })
  },

  selectMart: (townId) => {
    if (!isTownOpen(townId, get().martsOwned)) {
      return
    }

    set({ selectedMart: townId })
  },

  tick: (seconds) => {
    const state = get()
    const isAway = seconds >= AWAY_SECONDS
    const paidSeconds = Math.min(Math.max(seconds, 0), OFFLINE_CAP_SECONDS)
    const earned = chainSalesPerSecond(state) * paidSeconds
    const stats = isAway
      ? { ...state.stats, awayEarnings: state.stats.awayEarnings + earned }
      : {
          ...state.stats,
          playSeconds: state.stats.playSeconds + paidSeconds,
          salesEarnings: state.stats.salesEarnings + earned,
        }

    set({
      coins: state.coins + earned,
      stats,
      achievements: checkAchievements({ ...state, stats }),
      awayReport: isAway && earned > 0 ? { seconds: paidSeconds, earned } : state.awayReport,
    })
  },

  advanceTo: (now) => {
    get().tick(Math.max((now - get().paidUntil) / 1000, 0))
    set({ paidUntil: now })
  },

  dismissAwayReport: () => set({ awayReport: undefined }),

  reset: () => set(initialState()),
}))
