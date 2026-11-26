import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/shared/SectionCard'
import { ACHIEVEMENT_BONUS, franchiseBonus, LOCATION_BONUS } from '@/game/economy'
import { formatPercent } from '@/game/format'
import { useGame } from '@/game/store'
import { BonusLine } from './BonusLine'

export function FranchiseBonus() {
  const bonus = useGame(useShallow((state) => franchiseBonus(state)))

  return (
    <SectionCard
      title="Franchise bonus"
      action={<span className="text-sm font-medium">+{formatPercent(bonus.total)} all sales</span>}
    >
      <dl className="flex flex-col gap-1 text-xs tabular-nums">
        {bonus.extraLocations > 0 && (
          <BonusLine
            label="Locations after Pallet"
            count={bonus.extraLocations}
            each={LOCATION_BONUS}
          />
        )}
        <BonusLine label="Achievements" count={bonus.achievementTiers} each={ACHIEVEMENT_BONUS} />
      </dl>
    </SectionCard>
  )
}
