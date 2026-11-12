import type { EarnedAchievements } from './achievements'
import { ITEMS, type ItemId } from './items'
import { currentTown, nextTown, TOWNS, type Town, type TownId } from './towns'
import { REGISTER_UPGRADES, type RegisterUpgradeId } from './upgrades'

export const COST_GROWTH = 1.15
export const BASE_CLICK_VALUE = 1
export const MART_BONUS = 0.05
export const SHELF_CAPACITY = 100
export const RESTOCK_MILESTONES = [10, 25, 50, 100]
export const MILESTONE_BONUS = 0.05
export const ACHIEVEMENT_BONUS = 0.01
export const OFFLINE_RATE = 0.5
export const OFFLINE_CAP_SECONDS = 2 * 3600
/** The first minute of any gap pays full rate; only time past it counts as away. */
export const FULL_RATE_SECONDS = 60

export type BuyAmount = 1 | 10 | 'max'

export type Shelves = Record<ItemId, number>

export type Marts = Record<TownId, Shelves>

/** Everything that sets chain-wide sales. */
export interface Chain {
  marts: Marts
  martsOwned: number
  achievements: EarnedAchievements
}

/** Total cost of buying `count` units when `owned` are already owned. */
export function bulkCost(baseCost: number, owned: number, count: number): number {
  if (count <= 0) {
    return 0
  }

  return (baseCost * COST_GROWTH ** owned * (COST_GROWTH ** count - 1)) / (COST_GROWTH - 1)
}

/** Most units affordable with `coins` when `owned` are already owned. */
export function maxAffordable(baseCost: number, owned: number, coins: number): number {
  const next = baseCost * COST_GROWTH ** owned
  if (coins < next) {
    return 0
  }

  const count = Math.floor(Math.log((coins * (COST_GROWTH - 1)) / next + 1) / Math.log(COST_GROWTH))

  // Guard against floating-point overshoot at exact boundaries.
  return bulkCost(baseCost, owned, count) > coins ? count - 1 : count
}

/**
 * Units and price for a purchase, never past shelf capacity. For 'max', buys at least one so the
 * price shown is the next unit. A full shelf quotes zero units.
 */
export function purchaseQuote(
  baseCost: number,
  owned: number,
  coins: number,
  amount: BuyAmount,
): { count: number; cost: number } {
  const wanted = amount === 'max' ? Math.max(1, maxAffordable(baseCost, owned, coins)) : amount
  const count = Math.min(wanted, SHELF_CAPACITY - owned)

  return { count, cost: bulkCost(baseCost, owned, count) }
}

export function lowestShelf(shelves: Shelves, stock: ItemId[]): number {
  return Math.min(...stock.map((itemId) => shelves[itemId]))
}

/** How many restock milestones a mart has hit: every item it sells at 10, 25, 50, then 100 units. */
export function restockLevel(shelves: Shelves, stock: ItemId[]): number {
  const lowest = lowestShelf(shelves, stock)

  return RESTOCK_MILESTONES.filter((milestone) => lowest >= milestone).length
}

export interface ChainBonus {
  extraMarts: number
  milestones: number
  achievementTiers: number
  fromMarts: number
  fromRestocks: number
  fromAchievements: number
}

export function achievementTiers(earned: EarnedAchievements): number {
  return Object.values(earned).reduce((sum, tiers) => sum + tiers, 0)
}

/** +5% per mart after Pallet, +5% per restock milestone and +1% per achievement tier. */
export function chainBonus({ marts, martsOwned, achievements }: Chain): ChainBonus {
  const extraMarts = martsOwned - 1
  const milestones = TOWNS.reduce((sum, town) => sum + restockLevel(marts[town.id], town.stock), 0)
  const tiers = achievementTiers(achievements)

  return {
    extraMarts,
    milestones,
    achievementTiers: tiers,
    fromMarts: MART_BONUS * extraMarts,
    fromRestocks: MILESTONE_BONUS * milestones,
    fromAchievements: ACHIEVEMENT_BONUS * tiers,
  }
}

export function chainMultiplier(chain: Chain): number {
  const { fromMarts, fromRestocks, fromAchievements } = chainBonus(chain)

  return 1 + fromMarts + fromRestocks + fromAchievements
}

/** One mart's shelves, before the chain bonus. */
export function shelfSales(shelves: Shelves): number {
  return ITEMS.reduce((sum, item) => sum + item.salesPerSecond * shelves[item.id], 0)
}

export function chainSalesPerSecond(chain: Chain): number {
  const base = Object.values(chain.marts).reduce((sum, shelves) => sum + shelfSales(shelves), 0)

  return base * chainMultiplier(chain)
}

export interface OpenRequirements {
  town: Town
  hasCoins: boolean
  hasSales: boolean
  /** Items the newest mart has none of; every shelf needs at least one before moving on. */
  missing: ItemId[]
  ready: boolean
}

/** What's needed to open the next town's mart, or undefined once every mart is open. */
export function openRequirements(chain: Chain, coins: number): OpenRequirements | undefined {
  const { marts, martsOwned } = chain
  const town = nextTown(martsOwned)
  if (!town) {
    return undefined
  }

  const newest = currentTown(martsOwned)
  const missing = newest.stock.filter((itemId) => marts[newest.id][itemId] === 0)
  const hasCoins = coins >= town.openCost
  const hasSales = chainSalesPerSecond(chain) >= town.requiredSalesPerSecond

  return { town, hasCoins, hasSales, missing, ready: hasCoins && hasSales && missing.length === 0 }
}

/** One click: the base value doubled per ×2 upgrade, plus a share of chain sales per second. */
export function clickValue(registerUpgrades: RegisterUpgradeId[], salesPerSecond: number): number {
  const owned = new Set(registerUpgrades)
  let doublings = 0
  let salesShare = 0

  for (const upgrade of REGISTER_UPGRADES) {
    if (!owned.has(upgrade.id)) {
      continue
    }

    if (upgrade.effect.kind === 'double') {
      doublings++
    } else {
      salesShare += upgrade.effect.share
    }
  }

  return BASE_CLICK_VALUE * 2 ** doublings + salesShare * salesPerSecond
}

export interface AwayReport {
  seconds: number
  earned: number
}

/** Shelf sales while the game wasn't running: half rate, at most 2 hours. */
export function offlineEarnings(salesPerSecond: number, secondsAway: number): AwayReport {
  const seconds = Math.min(Math.max(secondsAway, 0), OFFLINE_CAP_SECONDS)

  return { seconds, earned: salesPerSecond * OFFLINE_RATE * seconds }
}
