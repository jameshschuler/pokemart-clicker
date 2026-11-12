import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ACHIEVEMENTS, TOTAL_ACHIEVEMENT_TIERS } from '@/game/achievements'
import { ACHIEVEMENT_BONUS, achievementTiers } from '@/game/economy'
import { formatPercent } from '@/game/format'
import { useGame } from '@/game/store'
import { AchievementCard } from './AchievementCard'

export function AchievementsDialog() {
  const earned = useGame((state) => achievementTiers(state.achievements))

  return (
    <Dialog>
      <DialogTrigger render={<Button size="xs" variant="ghost" />}>
        Achievements · {earned}/{TOTAL_ACHIEVEMENT_TIERS}
      </DialogTrigger>
      <DialogContent className="flex max-h-[85svh] flex-col gap-4 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Achievements</DialogTitle>
          <DialogDescription className="tabular-nums">
            {earned} of {TOTAL_ACHIEVEMENT_TIERS} earned · +{formatPercent(ACHIEVEMENT_BONUS)} all
            sales each, +{formatPercent(earned * ACHIEVEMENT_BONUS)} now
          </DialogDescription>
        </DialogHeader>
        <ul className="-mx-1 grid min-h-0 gap-3 overflow-y-auto px-1 py-1 sm:grid-cols-2">
          {ACHIEVEMENTS.map((achievement) => (
            <li key={achievement.id}>
              <AchievementCard achievement={achievement} />
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
