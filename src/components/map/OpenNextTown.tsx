import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { openRequirements, TOWN_BONUS } from '@/game/economy'
import { formatMoney, formatPercent, formatRate } from '@/game/format'
import { useGame } from '@/game/store'
import { shortTownName, TOWNS } from '@/game/towns'
import { RequirementLine } from './RequirementLine'

export function OpenNextTown() {
  const martsOwned = useGame((state) => state.martsOwned)
  const { town, hasCoins, hasIncome, ready } = useGame(
    useShallow((state) => {
      const requirements = openRequirements(state, state.coins)

      return {
        town: requirements?.town,
        hasCoins: requirements?.hasCoins ?? false,
        hasIncome: requirements?.hasIncome ?? false,
        ready: requirements?.ready ?? false,
      }
    }),
  )
  const openNextTown = useGame((state) => state.openNextTown)

  if (!town) {
    return martsOwned < TOWNS.length ? (
      <p className="px-3 text-xs text-muted-foreground">
        More of Kanto opens up in a later update.
      </p>
    ) : null
  }

  return (
    <Card size="sm" className="bg-muted/30 shadow-none">
      <CardContent className="flex flex-col gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Next location: {town.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            New items to stock · +{formatPercent(TOWN_BONUS)} franchise bonus
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <ul className="flex min-w-0 flex-1 flex-col gap-1 text-xs tabular-nums">
            <RequirementLine met={hasIncome}>
              Income ₽{formatRate(town.requiredIncome)}/s
            </RequirementLine>
            <RequirementLine met={hasCoins}>₽{formatMoney(town.openCost)} to open</RequirementLine>
          </ul>
          <Button size="sm" disabled={!ready} onClick={openNextTown} className="shrink-0">
            Open {shortTownName(town)}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
