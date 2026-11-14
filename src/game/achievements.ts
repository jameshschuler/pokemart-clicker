import { PRODUCERS, type Producer, type ProducerId } from './producers'
import { totalEarned } from './stats'
import type { GameState } from './store'
import { REGISTER_UPGRADES } from './upgrades'

export type AchievementId =
  'customersServed' | 'totalEarned' | 'allRegisterUpgrades' | `${ProducerId}Owned` | 'idleHands'

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

/** How many of a producer each of its achievement tiers needs. */
export const PRODUCER_GOALS = [1, 25, 50, 100, 500, 1_000]

/** One name per goal in PRODUCER_GOALS. */
type TierNames = [string, string, string, string, string, string]

/** Tier names for owning each producer. */
const PRODUCER_TIER_NAMES: Record<ProducerId, TierNames> = {
  flyer: [
    'Grand Opening',
    'Papered the Town',
    'Every Lamppost',
    'Pallet Wallpaper',
    'Paper Trail',
    'Flyer Blizzard',
  ],
  deliveryBike: [
    'First Delivery',
    'Bike Shop Regular',
    'Pedal Pushers',
    'Route 1 Rush Hour',
    'Cycling Road Club',
    'Fleet of a Thousand',
  ],
  vendingMachine: [
    'Coin Slot',
    'Vending Row',
    'Rooftop Envy',
    'Thirst Quenched',
    'Machine Kingdom',
    'Every Corner Covered',
  ],
  stockClerk: [
    'First Hire',
    'Full Shift',
    'Night Crew',
    'Shelf Command',
    'Stockroom Army',
    'Silph-Sized Staff',
  ],
}

function producerOwned(producer: Producer): Achievement {
  const names = PRODUCER_TIER_NAMES[producer.id]

  return {
    id: `${producer.id}Owned`,
    category: 'producers',
    tiers: PRODUCER_GOALS.map((goal, index) => ({
      goal,
      name: names[index],
      description:
        goal === 1
          ? `Buy your first ${producer.name}.`
          : `Own ${goal.toLocaleString('en-US')} ${producer.plural}.`,
    })),
    progress: (state) => state.producers[producer.id],
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
  ...PRODUCERS.map(producerOwned),
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
