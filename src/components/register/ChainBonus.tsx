import { useShallow } from 'zustand/react/shallow'
import { ACHIEVEMENT_BONUS, chainBonus, MART_BONUS, MILESTONE_BONUS } from '@/game/economy'
import { formatPercent } from '@/game/format'
import { useGame } from '@/game/store'

export function ChainBonus() {
  const { extraMarts, milestones, achievementTiers, fromMarts, fromMilestones, fromAchievements } =
    useGame(useShallow((state) => chainBonus(state)))

  return (
    <dl className="flex flex-col gap-1 rounded-md bg-muted/30 px-3 py-2 text-xs tabular-nums">
      <div className="flex justify-between gap-3 text-sm">
        <dt className="font-medium">Chain bonus</dt>
        <dd className="font-medium">
          +{formatPercent(fromMarts + fromMilestones + fromAchievements)} all sales
        </dd>
      </div>
      <div className="flex justify-between gap-3 text-muted-foreground">
        <dt className="min-w-0 truncate">
          Marts opened after Pallet · {extraMarts} × {formatPercent(MART_BONUS)}
        </dt>
        <dd>+{formatPercent(fromMarts)}</dd>
      </div>
      <div className="flex justify-between gap-3 text-muted-foreground">
        <dt className="min-w-0 truncate">
          Order milestones · {milestones} × {formatPercent(MILESTONE_BONUS)}
        </dt>
        <dd>+{formatPercent(fromMilestones)}</dd>
      </div>
      <div className="flex justify-between gap-3 text-muted-foreground">
        <dt className="min-w-0 truncate">
          Achievements · {achievementTiers} × {formatPercent(ACHIEVEMENT_BONUS)}
        </dt>
        <dd>+{formatPercent(fromAchievements)}</dd>
      </div>
    </dl>
  )
}
