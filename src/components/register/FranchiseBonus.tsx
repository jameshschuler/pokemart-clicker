import { useShallow } from 'zustand/react/shallow'
import { ACHIEVEMENT_BONUS, franchiseBonus, LOCATION_BONUS } from '@/game/economy'
import { formatPercent } from '@/game/format'
import { useGame } from '@/game/store'

export function FranchiseBonus() {
  const { extraLocations, achievementTiers, fromLocations, fromAchievements } = useGame(
    useShallow((state) => franchiseBonus(state)),
  )

  return (
    <dl className="flex flex-col gap-1 rounded-md bg-muted/30 px-3 py-2 text-xs tabular-nums">
      <div className="flex justify-between gap-3 text-sm">
        <dt className="font-medium">Franchise bonus</dt>
        <dd className="font-medium">
          +{formatPercent(fromLocations + fromAchievements)} all sales
        </dd>
      </div>
      {extraLocations > 0 && (
        <div className="flex justify-between gap-3 text-muted-foreground">
          <dt className="min-w-0 truncate">
            Locations after Pallet · {extraLocations} × {formatPercent(LOCATION_BONUS)}
          </dt>
          <dd>+{formatPercent(fromLocations)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-3 text-muted-foreground">
        <dt className="min-w-0 truncate">
          Achievements · {achievementTiers} × {formatPercent(ACHIEVEMENT_BONUS)}
        </dt>
        <dd>+{formatPercent(fromAchievements)}</dd>
      </div>
    </dl>
  )
}
