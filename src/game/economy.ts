import type { EarnedAchievements } from './achievements'
import { ITEMS, type ItemId } from './items'
import { currentTown, nextTown, TOWNS, type Town, type TownId } from './towns'
import { REGISTER_UPGRADES, type RegisterUpgradeId } from './upgrades'

export const COST_GROWTH = 1.15
export const BASE_CLICK_VALUE = 1
export const MART_BONUS = 0.05
export const ORDER_MILESTONES = [10, 25, 50, 100]
/** A town counts as stocked once every item's daily order reaches this. */
export const STOCKED_ORDER = 25
export const MILESTONE_BONUS = 0.05
export const ACHIEVEMENT_BONUS = 0.01
export const OFFLINE_CAP_SECONDS = 2 * 3600
/** Gaps this long count as time away: paid in full up to the cap, with a welcome back report. */
export const AWAY_SECONDS = 15 * 60

export type BuyAmount = 1 | 10 | 'max'

/** Units a day ordered of each item, for one mart. */
export type Orders = Record<ItemId, number>

export type Marts = Record<TownId, Orders>

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

/** Units and price for a purchase. For 'max', buys at least one so the price shown is the next unit. */
export function purchaseQuote(
  baseCost: number,
  owned: number,
  coins: number,
  amount: BuyAmount,
): { count: number; cost: number } {
  const count = amount === 'max' ? Math.max(1, maxAffordable(baseCost, owned, coins)) : amount

  return { count, cost: bulkCost(baseCost, owned, count) }
}

export function smallestOrder(orders: Orders, stock: ItemId[]): number {
  return Math.min(...stock.map((itemId) => orders[itemId]))
}

export function isStocked(orders: Orders, stock: ItemId[]): boolean {
  return smallestOrder(orders, stock) >= STOCKED_ORDER
}

/** How many order milestones a mart has hit: every item it sells at 10, 25, 50, then 100 a day. */
export function milestoneLevel(orders: Orders, stock: ItemId[]): number {
  const smallest = smallestOrder(orders, stock)

  return ORDER_MILESTONES.filter((milestone) => smallest >= milestone).length
}

export interface ChainBonus {
  extraMarts: number
  milestones: number
  achievementTiers: number
  fromMarts: number
  fromMilestones: number
  fromAchievements: number
}

export function achievementTiers(earned: EarnedAchievements): number {
  return Object.values(earned).reduce((sum, tiers) => sum + tiers, 0)
}

/** +5% per mart after Pallet, +5% per order milestone and +1% per achievement tier. */
export function chainBonus({ marts, martsOwned, achievements }: Chain): ChainBonus {
  const extraMarts = martsOwned - 1
  const milestones = TOWNS.reduce(
    (sum, town) => sum + milestoneLevel(marts[town.id], town.stock),
    0,
  )
  const tiers = achievementTiers(achievements)

  return {
    extraMarts,
    milestones,
    achievementTiers: tiers,
    fromMarts: MART_BONUS * extraMarts,
    fromMilestones: MILESTONE_BONUS * milestones,
    fromAchievements: ACHIEVEMENT_BONUS * tiers,
  }
}

export function chainMultiplier(chain: Chain): number {
  const { fromMarts, fromMilestones, fromAchievements } = chainBonus(chain)

  return 1 + fromMarts + fromMilestones + fromAchievements
}

/** One mart's daily orders, before the chain bonus. */
export function martSales(orders: Orders): number {
  return ITEMS.reduce((sum, item) => sum + item.salesPerSecond * orders[item.id], 0)
}

export function chainSalesPerSecond(chain: Chain): number {
  const base = Object.values(chain.marts).reduce((sum, orders) => sum + martSales(orders), 0)

  return base * chainMultiplier(chain)
}

export interface OpenRequirements {
  town: Town
  hasCoins: boolean
  hasSales: boolean
  /** Items the newest mart doesn't order yet; every item needs at least one a day before moving on. */
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
