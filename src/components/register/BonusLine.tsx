import { formatPercent } from '@/game/format'

interface BonusLineProps {
  label: string
  count: number
  each: number
}

export function BonusLine({ label, count, each }: BonusLineProps) {
  return (
    <div className="flex justify-between gap-3 text-muted-foreground">
      <dt className="min-w-0 truncate">
        {label} · {count} × {formatPercent(each)}
      </dt>
      <dd>+{formatPercent(count * each)}</dd>
    </div>
  )
}
