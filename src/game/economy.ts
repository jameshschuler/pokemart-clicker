import type { EarnedAchievements } from './achievements'
import type { ItemId } from './items'
import { type MartLocation, nextLocation } from './locations'
import { type Producer, type ProducerId, PRODUCERS } from './producers'
import { saleValue } from './stocking'
import { REGISTER_UPGRADES, type RegisterUpgradeId } from './upgrades'

export const COST_GROWTH = 1.15
export const LOCATION_BONUS = 0.05
export const ACHIEVEMENT_BONUS = 0.01
export const OFFLINE_CAP_SECONDS = 2 * 3600
/** Gaps this long count as time away: paid in full up to the cap, with a welcome back report. */
export const AWAY_SECONDS = 15 * 60

export type BuyAmount = 1 | 10 | 'max'

/** How many of each producer the franchise owns. */
export type Producers = Record<ProducerId, number>

/** Everything that sets franchise income. */
export interface Franchise {
  producers: Producers
  stockedItems: ItemId[]
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

export interface FranchiseBonus {
  extraLocations: number
  achievementTiers: number
  fromLocations: number
  fromAchievements: number
}

export function achievementTiers(earned: EarnedAchievements): number {
  return Object.values(earned).reduce((sum, tiers) => sum + tiers, 0)
}

/** +5% per location after Pallet and +1% per achievement tier. */
export function franchiseBonus({ martsOwned, achievements }: Franchise): FranchiseBonus {
  const extraLocations = martsOwned - 1
  const tiers = achievementTiers(achievements)

  return {
    extraLocations,
    achievementTiers: tiers,
    fromLocations: LOCATION_BONUS * extraLocations,
    fromAchievements: ACHIEVEMENT_BONUS * tiers,
  }
}

export function franchiseMultiplier(franchise: Franchise): number {
  const { fromLocations, fromAchievements } = franchiseBonus(franchise)

  return 1 + fromLocations + fromAchievements
}

/** Sales per second from every producer, before the franchise bonus. */
export function salesPerSecond(producers: Producers): number {
  return PRODUCERS.reduce(
    (sum, producer) => sum + producer.salesPerSecond * producers[producer.id],
    0,
  )
}

/** ₽ per second one of a producer earns, franchise bonus included. */
export function producerIncome(franchise: Franchise, producer: Producer): number {
  return (
    producer.salesPerSecond * saleValue(franchise.stockedItems) * franchiseMultiplier(franchise)
  )
}

/** ₽ per second for the whole franchise. */
export function incomePerSecond(franchise: Franchise): number {
  const { producers, stockedItems } = franchise

  return salesPerSecond(producers) * saleValue(stockedItems) * franchiseMultiplier(franchise)
}

/** One click makes one sale, plus each owned register upgrade's share of income per second. */
export function clickValue(
  registerUpgrades: RegisterUpgradeId[],
  sale: number,
  income: number,
): number {
  const owned = new Set(registerUpgrades)
  const incomeShare = REGISTER_UPGRADES.filter((upgrade) => owned.has(upgrade.id)).reduce(
    (sum, upgrade) => sum + upgrade.incomeShare,
    0,
  )

  return sale + incomeShare * income
}

export interface OpenRequirements {
  location: MartLocation
  hasCoins: boolean
  hasIncome: boolean
  ready: boolean
}

/** What's needed to open the next location, or undefined when no location can open yet. */
export function openRequirements(
  franchise: Franchise,
  coins: number,
): OpenRequirements | undefined {
  const location = nextLocation(franchise.martsOwned)
  if (!location) {
    return undefined
  }

  const hasCoins = coins >= location.openCost
  const hasIncome = incomePerSecond(franchise) >= location.requiredIncome

  return { location, hasCoins, hasIncome, ready: hasCoins && hasIncome }
}

export interface AwayReport {
  seconds: number
  earned: number
}
