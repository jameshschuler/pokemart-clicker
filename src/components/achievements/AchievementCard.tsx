import { Card, CardContent } from '@/components/ui/card'
import { CATEGORY_LABELS, type Achievement } from '@/game/achievements'
import { formatMoney } from '@/game/format'
import { useGame } from '@/game/store'
import { cn } from '@/lib/utils'
import { TierPips } from './TierPips'

interface AchievementCardProps {
  achievement: Achievement
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const earned = useGame((state) => state.achievements[achievement.id])
  const next = achievement.tiers[earned]
  const progress = useGame((state) => (next ? Math.min(achievement.progress(state), next.goal) : 0))
  const secret = achievement.category === 'hidden' && earned === 0
  const shown = achievement.tiers[Math.max(earned - 1, 0)]
  const unit = achievement.category === 'earnings' ? '₽' : ''

  return (
    <Card
      size="sm"
      className={cn('rounded-lg shadow-none', earned === 0 && 'bg-muted/30 ring-foreground/5')}
    >
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="truncate">{CATEGORY_LABELS[achievement.category]}</span>
          {achievement.tiers.length > 1 && (
            <TierPips earned={earned} total={achievement.tiers.length} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className={cn('truncate font-medium', earned === 0 && 'text-muted-foreground')}>
            {secret ? '???' : shown.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {secret ? 'Keep playing to find this one.' : (next ?? shown).description}
          </p>
        </div>

        {next && !secret ? (
          <div className="flex flex-col gap-1.5">
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${(progress / next.goal) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {unit}
              {formatMoney(progress)} / {unit}
              {formatMoney(next.goal)}
            </span>
          </div>
        ) : (
          <span className="text-xs font-medium text-primary">{secret ? 'Hidden' : 'Complete'}</span>
        )}
      </CardContent>
    </Card>
  )
}
