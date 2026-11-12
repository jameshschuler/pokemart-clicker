import { useEffect, useState } from 'react'
import { ACHIEVEMENTS, type AchievementTier } from '@/game/achievements'
import { ACHIEVEMENT_BONUS } from '@/game/economy'
import { formatPercent } from '@/game/format'
import { useGame } from '@/game/store'

const TOAST_MS = 4_000

interface Toast {
  key: string
  tier: AchievementTier
}

export function AchievementToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(
    () =>
      useGame.subscribe((state, previous) => {
        if (state.achievements === previous.achievements) {
          return
        }

        const earned = ACHIEVEMENTS.flatMap((achievement) =>
          achievement.tiers
            .slice(previous.achievements[achievement.id], state.achievements[achievement.id])
            .map((tier) => ({ key: `${achievement.id}-${tier.goal}`, tier })),
        )
        const keys = new Set(earned.map((toast) => toast.key))
        setToasts((shown) => [...shown, ...earned])
        setTimeout(
          () => setToasts((shown) => shown.filter((toast) => !keys.has(toast.key))),
          TOAST_MS,
        )
      }),
    [],
  )

  return (
    <ol
      aria-live="polite"
      className="fixed right-4 bottom-4 z-50 flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-2"
    >
      {toasts.map(({ key, tier }) => (
        <li
          key={key}
          className="rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground shadow-sm animate-in fade-in slide-in-from-bottom-2"
        >
          <p className="truncate text-xs text-muted-foreground">
            Achievement earned · +{formatPercent(ACHIEVEMENT_BONUS)} all sales
          </p>
          <p className="truncate text-sm font-medium">{tier.name}</p>
          <p className="truncate text-xs text-muted-foreground">{tier.description}</p>
        </li>
      ))}
    </ol>
  )
}
