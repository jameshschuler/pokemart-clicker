export interface LifetimeStats {
  startedAt: number
  playSeconds: number
  clicks: number
  clickEarnings: number
  salesEarnings: number
  totalSpent: number
  itemsStocked: number
  /** One per purchase of 10+ Poké Balls at once, like the games' free Premier Ball. */
  premierBalls: number
}

export function emptyStats(startedAt: number): LifetimeStats {
  return {
    startedAt,
    playSeconds: 0,
    clicks: 0,
    clickEarnings: 0,
    salesEarnings: 0,
    totalSpent: 0,
    itemsStocked: 0,
    premierBalls: 0,
  }
}

export function totalEarned(stats: LifetimeStats): number {
  return stats.clickEarnings + stats.salesEarnings
}
