import { useShallow } from 'zustand/react/shallow'
import { ACHIEVEMENT_BONUS, franchiseBonus, LOCATION_BONUS } from '@/game/economy'
import { formatPercent } from '@/game/format'
import { useGame } from '@/game/store'
import { BonusLine } from './BonusLine'

export function FranchiseBonus() {
  const bonus = useGame(useShallow((state) => franchiseBonus(state)))

  return (
    <dl className="flex flex-col gap-1 rounded-md bg-muted/30 px-3 py-2 text-xs tabular-nums">
      <div className="flex justify-between gap-3 text-sm">
        <dt className="font-medium">Franchise bonus</dt>
        <dd className="font-medium">+{formatPercent(bonus.total)} all sales</dd>
      </div>
      {bonus.extraLocations > 0 && (
        <BonusLine
          label="Locations after Pallet"
          count={bonus.extraLocations}
          each={LOCATION_BONUS}
        />
      )}
      <BonusLine label="Achievements" count={bonus.achievementTiers} each={ACHIEVEMENT_BONUS} />
    </dl>
  )
}
