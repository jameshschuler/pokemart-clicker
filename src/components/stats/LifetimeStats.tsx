import { formatDuration, formatMoney } from '@/game/format'
import { totalEarned } from '@/game/stats'
import { useGame } from '@/game/store'

export function LifetimeStats() {
  const stats = useGame((state) => state.stats)
  const rows: [string, string][] = [
    ['Time played', formatDuration(stats.playSeconds)],
    ['Customers served', stats.clicks.toLocaleString('en-US')],
    ['Earned at the register', `₽${formatMoney(stats.clickEarnings)}`],
    ['Earned from shelves', `₽${formatMoney(stats.salesEarnings)}`],
    ['Earned while away', `₽${formatMoney(stats.awayEarnings)}`],
    ['Total earned', `₽${formatMoney(totalEarned(stats))}`],
    ['Total spent', `₽${formatMoney(stats.totalSpent)}`],
    ['Items stocked', stats.itemsStocked.toLocaleString('en-US')],
    ['Opened your first mart', new Date(stats.startedAt).toLocaleDateString()],
  ]

  return (
    <dl className="flex flex-col gap-1.5 text-sm tabular-nums">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-3">
          <dt className="min-w-0 truncate text-muted-foreground">{label}</dt>
          <dd className="shrink-0">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
