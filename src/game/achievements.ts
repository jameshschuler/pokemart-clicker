import { restockLevel } from './economy'
import { totalEarned } from './stats'
import type { GameState } from './store'
import { TOWNS } from './towns'
import { REGISTER_UPGRADES } from './upgrades'

export type AchievementId =
  | 'customersServed'
  | 'totalEarned'
  | 'martsOpened'
  | 'firstRestock'
  | 'allRegisterUpgrades'
  | 'itemsStocked'
  | 'potionHoarder'
  | 'premierCustomer'

export type AchievementCategory =
  'register' | 'earnings' | 'chain' | 'shelves' | 'upgrades' | 'stocking' | 'hidden'

export const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  register: 'Register',
  earnings: 'Earnings',
  chain: 'Chain',
  shelves: 'Shelves',
  upgrades: 'Upgrades',
  stocking: 'Stocking',
  hidden: 'Hidden',
}

export interface AchievementTier {
  goal: number
  name: string
  description: string
}

/** One tier is a one-time achievement; more tiers are earned in order. */
export interface Achievement {
  id: AchievementId
  category: AchievementCategory
  tiers: AchievementTier[]
  progress: (state: GameState) => number
}

/** Tiers earned per achievement. */
export type EarnedAchievements = Record<AchievementId, number>

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'customersServed',
    category: 'register',
    tiers: [
      {
        goal: 100,
        name: 'Open for Business',
        description: 'Serve 100 customers.',
      },
      {
        goal: 1_000,
        name: 'Regular Rush',
        description: 'Serve 1,000 customers.',
      },
      {
        goal: 10_000,
        name: 'Queue Out the Door',
        description: 'Serve 10,000 customers.',
      },
    ],
    progress: (state) => state.stats.clicks,
  },
  {
    id: 'totalEarned',
    category: 'earnings',
    tiers: [
      {
        goal: 1_000,
        name: 'Pocket Money',
        description: 'Earn ₽1,000 in total.',
      },
      { goal: 1e6, name: 'Millionaire', description: 'Earn ₽1M in total.' },
      {
        goal: 100e6,
        name: 'Silph Shareholder',
        description: 'Earn ₽100M in total.',
      },
    ],
    progress: (state) => totalEarned(state.stats),
  },
  {
    id: 'martsOpened',
    category: 'chain',
    tiers: [
      { goal: 3, name: 'Small Chain', description: 'Own 3 marts.' },
      { goal: 6, name: 'Regional Chain', description: 'Own 6 marts.' },
      {
        goal: TOWNS.length,
        name: 'Kanto Chain',
        description: 'Own a mart in every Kanto town.',
      },
    ],
    progress: (state) => state.martsOwned,
  },
  {
    id: 'firstRestock',
    category: 'shelves',
    tiers: [
      {
        goal: 1,
        name: 'Restocked',
        description: 'Reach a restock milestone in any mart.',
      },
    ],
    progress: (state) =>
      Math.max(...TOWNS.map((town) => restockLevel(state.marts[town.id], town.stock))),
  },
  {
    id: 'allRegisterUpgrades',
    category: 'upgrades',
    tiers: [
      {
        goal: REGISTER_UPGRADES.length,
        name: 'Self-Service',
        description: 'Buy every register upgrade.',
      },
    ],
    progress: (state) => state.registerUpgrades.length,
  },
  {
    id: 'itemsStocked',
    category: 'stocking',
    tiers: [
      { goal: 100, name: 'Stock Boy', description: 'Stock 100 items.' },
      { goal: 1_000, name: 'Warehouse Run', description: 'Stock 1,000 items.' },
      {
        goal: 10_000,
        name: 'Supply Chain',
        description: 'Stock 10,000 items.',
      },
    ],
    progress: (state) => state.stats.itemsStocked,
  },
  {
    id: 'potionHoarder',
    category: 'hidden',
    tiers: [
      {
        goal: 100,
        name: 'Potion Hoarder',
        description: 'Fill Pallet Town with 100 Potions.',
      },
    ],
    progress: (state) => state.marts.pallet.potion,
  },
  {
    id: 'premierCustomer',
    category: 'hidden',
    tiers: [
      {
        goal: 1,
        name: 'Premier Customer',
        description: 'Buy 10 Poké Balls at once. The clerk throws in a Premier Ball.',
      },
    ],
    progress: (state) => state.stats.premierBalls,
  },
]

export const TOTAL_ACHIEVEMENT_TIERS = ACHIEVEMENTS.reduce(
  (sum, achievement) => sum + achievement.tiers.length,
  0,
)

export function emptyAchievements(): EarnedAchievements {
  return Object.fromEntries(
    ACHIEVEMENTS.map((achievement) => [achievement.id, 0]),
  ) as EarnedAchievements
}

export function tiersReached(achievement: Achievement, progress: number): number {
  return achievement.tiers.filter((tier) => progress >= tier.goal).length
}

/** Earned tiers never go down. Returns `earned` unchanged when nothing new was reached. */
export function checkAchievements(state: GameState): EarnedAchievements {
  const { achievements: earned } = state
  let next = earned

  for (const achievement of ACHIEVEMENTS) {
    const reached = tiersReached(achievement, achievement.progress(state))
    if (reached > next[achievement.id]) {
      next = { ...next, [achievement.id]: reached }
    }
  }

  return next
}
