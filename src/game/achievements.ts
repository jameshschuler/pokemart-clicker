import { isStocked, milestoneLevel, STOCKED_ORDER } from './economy'
import { totalEarned } from './stats'
import type { GameState } from './store'
import { TOWNS, type Town, type TownId } from './towns'
import { REGISTER_UPGRADES } from './upgrades'

export type AchievementId =
  | 'customersServed'
  | 'totalEarned'
  | 'martsOpened'
  | 'firstMilestone'
  | 'allRegisterUpgrades'
  | 'unitsOrdered'
  | 'idleHands'
  | 'premierCustomer'
  | `${TownId}Stocked`
  | 'kantoStocked'

export type AchievementCategory =
  'register' | 'earnings' | 'chain' | 'milestones' | 'upgrades' | 'orders' | 'hidden'

export const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  register: 'Register',
  earnings: 'Earnings',
  chain: 'Chain',
  milestones: 'Milestones',
  upgrades: 'Upgrades',
  orders: 'Orders',
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

function townStocked(town: Town): Achievement {
  return {
    id: `${town.id}Stocked`,
    category: 'milestones',
    tiers: [
      {
        goal: 1,
        name: `${town.name} Stocked`,
        description: `Order ${STOCKED_ORDER} a day of every item in ${town.name}.`,
      },
    ],
    progress: (state) => (isStocked(state.marts[town.id], town.stock) ? 1 : 0),
  }
}

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
    id: 'firstMilestone',
    category: 'milestones',
    tiers: [
      {
        goal: 1,
        name: 'Steady Supply',
        description: 'Reach an order milestone in any mart.',
      },
    ],
    progress: (state) =>
      Math.max(...TOWNS.map((town) => milestoneLevel(state.marts[town.id], town.stock))),
  },
  ...TOWNS.map(townStocked),
  {
    id: 'kantoStocked',
    category: 'milestones',
    tiers: [
      {
        goal: TOWNS.length,
        name: 'Kanto Stocked',
        description: `Order ${STOCKED_ORDER} a day of every item in all ${TOWNS.length} Kanto marts.`,
      },
    ],
    progress: (state) => TOWNS.filter((town) => isStocked(state.marts[town.id], town.stock)).length,
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
    id: 'unitsOrdered',
    category: 'orders',
    tiers: [
      { goal: 100, name: 'Stock Boy', description: 'Order 100 units a day in total.' },
      { goal: 1_000, name: 'Warehouse Run', description: 'Order 1,000 units a day in total.' },
      {
        goal: 10_000,
        name: 'Supply Chain',
        description: 'Order 10,000 units a day in total.',
      },
    ],
    progress: (state) => state.stats.unitsOrdered,
  },
  {
    id: 'idleHands',
    category: 'hidden',
    tiers: [
      {
        goal: 1e6,
        name: 'Idle Hands',
        description: 'Earn ₽1M while you were away.',
      },
    ],
    progress: (state) => state.stats.awayEarnings,
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
