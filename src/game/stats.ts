export interface LifetimeStats {
  startedAt: number
  playSeconds: number
  clicks: number
  clickEarnings: number
  salesEarnings: number
  awayEarnings: number
  totalSpent: number
  unitsOrdered: number
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
    awayEarnings: 0,
    totalSpent: 0,
    unitsOrdered: 0,
    premierBalls: 0,
  }
}

export function totalEarned(stats: LifetimeStats): number {
  return stats.clickEarnings + stats.salesEarnings + stats.awayEarnings
}
