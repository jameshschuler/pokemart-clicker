import { totalEarned } from './stats'
import type { GameState } from './store'
import { REGISTER_UPGRADES } from './upgrades'

export type AchievementId =
  'customersServed' | 'totalEarned' | 'allRegisterUpgrades' | 'flyersPosted' | 'idleHands'

export type AchievementCategory = 'register' | 'earnings' | 'upgrades' | 'producers' | 'hidden'

export const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  register: 'Register',
  earnings: 'Earnings',
  upgrades: 'Upgrades',
  producers: 'Producers',
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
    id: 'flyersPosted',
    category: 'producers',
    tiers: [
      { goal: 1, name: 'Grand Opening', description: 'Post a flyer.' },
      { goal: 10, name: 'Papered the Town', description: 'Post 10 flyers.' },
      { goal: 25, name: 'Every Lamppost', description: 'Post 25 flyers.' },
    ],
    progress: (state) => state.producers.flyer,
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
