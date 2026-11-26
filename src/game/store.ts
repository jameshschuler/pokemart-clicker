import { create } from 'zustand'
import { checkAchievements, type EarnedAchievements, emptyAchievements } from './achievements'
import {
  AWAY_SECONDS,
  type AwayReport,
  type BuyAmount,
  clickValue,
  incomePerSecond,
  openRequirements,
  type Producers,
  purchaseQuote,
} from './economy'
import { type Eeveelution, type EeveeForm, evolutionFor } from './eevee'
import type { ItemId } from './items'
import { isLocationOpen, nextFloor } from './locations'
import { type ProducerId, PRODUCERS } from './producers'
import { emptyStats, type LifetimeStats } from './stats'
import { stockOffers } from './stocking'
import { availableRegisterUpgrades, type RegisterUpgradeId } from './upgrades'

export interface GameState {
  coins: number
  producers: Producers
  stockedItems: ItemId[]
  martsOwned: number
  /** Department Store floors open, counting the one that opens with Celadon. */
  floorsOpen: number
  eevee: EeveeForm | null
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
  buyProducer: (producerId: ProducerId, amount: BuyAmount) => void
  stockItem: (itemId: ItemId) => void
  openNextLocation: () => void
  openNextFloor: () => void
  findEevee: () => void
  evolveEevee: (form: Eeveelution) => void
  buyRegisterUpgrade: (upgradeId: RegisterUpgradeId) => void
  tick: (seconds: number) => void
  advanceTo: (now: number) => void
  dismissAwayReport: () => void
  reset: () => void
}

const PRODUCER_BY_ID = new Map(PRODUCERS.map((producer) => [producer.id, producer]))

export function emptyProducers(): Producers {
  return Object.fromEntries(PRODUCERS.map((producer) => [producer.id, 0])) as Producers
}

export function initialState(): GameState {
  return {
    coins: 0,
    producers: emptyProducers(),
    stockedItems: [],
    martsOwned: 1,
    floorsOpen: 1,
    eevee: null,
    registerUpgrades: [],
    stats: emptyStats(Date.now()),
    achievements: emptyAchievements(),
    paidUntil: Date.now(),
    awayReport: undefined,
  }
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
    const state = get()
    const earned = clickValue(state)
    set({
      coins: state.coins + earned,
      stats: {
        ...state.stats,
        clicks: state.stats.clicks + 1,
        clickEarnings: state.stats.clickEarnings + earned,
      },
    })

    return earned
  },

  buyProducer: (producerId, amount) => {
    const state = get()
    const { coins, producers, martsOwned } = state
    const producer = PRODUCER_BY_ID.get(producerId)
    if (!producer || !isLocationOpen(producer.location, martsOwned)) {
      return
    }

    const { count, cost } = purchaseQuote(producer.baseCost, producers[producerId], coins, amount)
    if (cost > coins) {
      return
    }

    set({
      ...spend(state, cost),
      producers: { ...producers, [producerId]: producers[producerId] + count },
    })
  },

  stockItem: (itemId) => {
    const state = get()
    const { coins, stockedItems, martsOwned, floorsOpen } = state
    const offer = stockOffers(martsOwned, floorsOpen).find(
      (candidate) => candidate.item.id === itemId,
    )
    if (!offer || stockedItems.includes(itemId) || offer.cost > coins) {
      return
    }

    set({ ...spend(state, offer.cost), stockedItems: [...stockedItems, itemId] })
  },

  openNextLocation: () => {
    const state = get()
    const requirements = openRequirements(state, state.coins)
    if (!requirements?.ready) {
      return
    }

    set({ ...spend(state, requirements.location.openCost), martsOwned: state.martsOwned + 1 })
  },

  openNextFloor: () => {
    const state = get()
    const floor = nextFloor(state.martsOwned, state.floorsOpen)
    if (!floor?.openCost || floor.openCost > state.coins) {
      return
    }

    set({ ...spend(state, floor.openCost), floorsOpen: state.floorsOpen + 1 })
  },

  findEevee: () => {
    const state = get()
    if (state.eevee || !isLocationOpen('celadon', state.martsOwned)) {
      return
    }

    set({ eevee: 'eevee', achievements: checkAchievements({ ...state, eevee: 'eevee' }) })
  },

  evolveEevee: (form) => {
    const state = get()
    const evolution = evolutionFor(form)
    if (state.eevee !== 'eevee' || !evolution || !state.stockedItems.includes(evolution.stone)) {
      return
    }

    set({ eevee: form, achievements: checkAchievements({ ...state, eevee: form }) })
  },

  buyRegisterUpgrade: (upgradeId) => {
    const state = get()
    const { coins, registerUpgrades, martsOwned } = state
    const upgrade = availableRegisterUpgrades(registerUpgrades, martsOwned).find(
      (offered) => offered.id === upgradeId,
    )
    if (!upgrade || upgrade.cost > coins) {
      return
    }

    set({ ...spend(state, upgrade.cost), registerUpgrades: [...registerUpgrades, upgradeId] })
  },

  tick: (seconds) => {
    const state = get()
    const isAway = seconds >= AWAY_SECONDS
    const paidSeconds = Math.max(seconds, 0)
    const earned = incomePerSecond(state) * paidSeconds
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
