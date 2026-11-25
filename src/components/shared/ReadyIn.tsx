import { incomePerSecond, secondsUntilAffordable } from '@/game/economy'
import { formatDuration } from '@/game/format'
import { useGame } from '@/game/store'
import { cn } from '@/lib/utils'

interface ReadyInProps {
  cost: number
  className?: string
}

/** Counts down until income covers `cost`; blank once affordable or with no income. */
export function ReadyIn({ cost, className }: ReadyInProps) {
  // Whole seconds, so it re-renders once a second rather than every frame.
  const secondsLeft = useGame((state) =>
    Math.ceil(secondsUntilAffordable(cost, state.coins, incomePerSecond(state))),
  )
  const counting = secondsLeft > 0 && Number.isFinite(secondsLeft)

  // Always takes its line, so rows don't jump when the countdown starts or ends.
  return (
    <span
      aria-hidden={!counting}
      className={cn(
        'truncate text-xs text-muted-foreground tabular-nums',
        !counting && 'invisible',
        className,
      )}
    >
      {counting ? `Ready in ${formatDuration(secondsLeft)}` : '\u00a0'}
    </span>
  )
}
