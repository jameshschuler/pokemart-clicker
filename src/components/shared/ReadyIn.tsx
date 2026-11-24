import { incomePerSecond, secondsUntilAffordable } from '@/game/economy'
import { formatDuration } from '@/game/format'
import { useGame } from '@/game/store'
import { cn } from '@/lib/utils'

interface ReadyInProps {
  cost: number
  className?: string
}

/** Counts down until income covers `cost`; hidden once affordable or with no income. */
export function ReadyIn({ cost, className }: ReadyInProps) {
  // Whole seconds, so it re-renders once a second rather than every frame.
  const secondsLeft = useGame((state) =>
    Math.ceil(secondsUntilAffordable(cost, state.coins, incomePerSecond(state))),
  )

  if (secondsLeft === 0 || !Number.isFinite(secondsLeft)) {
    return null
  }

  return (
    <span className={cn('truncate text-xs text-muted-foreground tabular-nums', className)}>
      Ready in {formatDuration(secondsLeft)}
    </span>
  )
}
