import type { EarnedAchievements } from './achievements'
import { PRODUCERS, type Producer, type ProducerId } from './producers'
import { REGISTER_UPGRADES, type RegisterUpgradeId } from './upgrades'

export const COST_GROWTH = 1.15
/** What one sale is worth, before item upgrades. */
export const SALE_VALUE = 1
export const TOWN_BONUS = 0.05
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
  extraTowns: number
  achievementTiers: number
  fromTowns: number
  fromAchievements: number
}

export function achievementTiers(earned: EarnedAchievements): number {
  return Object.values(earned).reduce((sum, tiers) => sum + tiers, 0)
}

/** +5% per town after Pallet and +1% per achievement tier. */
export function franchiseBonus({ martsOwned, achievements }: Franchise): FranchiseBonus {
  const extraTowns = martsOwned - 1
  const tiers = achievementTiers(achievements)

  return {
    extraTowns,
    achievementTiers: tiers,
    fromTowns: TOWN_BONUS * extraTowns,
    fromAchievements: ACHIEVEMENT_BONUS * tiers,
  }
}

export function franchiseMultiplier(franchise: Franchise): number {
  const { fromTowns, fromAchievements } = franchiseBonus(franchise)

  return 1 + fromTowns + fromAchievements
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
  return producer.salesPerSecond * SALE_VALUE * franchiseMultiplier(franchise)
}

/** ₽ per second for the whole franchise. */
export function incomePerSecond(franchise: Franchise): number {
  return salesPerSecond(franchise.producers) * SALE_VALUE * franchiseMultiplier(franchise)
}

/** One click makes one sale: its value doubled per ×2 upgrade, plus a share of income per second. */
export function clickValue(registerUpgrades: RegisterUpgradeId[], income: number): number {
  const owned = new Set(registerUpgrades)
  let doublings = 0
  let incomeShare = 0

  for (const upgrade of REGISTER_UPGRADES) {
    if (!owned.has(upgrade.id)) {
      continue
    }

    if (upgrade.effect.kind === 'double') {
      doublings++
    } else {
      incomeShare += upgrade.effect.share
    }
  }

  return SALE_VALUE * 2 ** doublings + incomeShare * income
}

export interface AwayReport {
  seconds: number
  earned: number
}
