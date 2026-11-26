import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LOCATION_BONUS, openRequirements } from '@/game/economy'
import { formatMoney, formatPercent, formatRate } from '@/game/format'
import { useGame } from '@/game/store'
import { RequirementLine } from './RequirementLine'

export function OpenNextLocation() {
  const { location, hasCoins, hasIncome, ready } = useGame(
    useShallow((state) => {
      const requirements = openRequirements(state, state.coins)

      return {
        location: requirements?.location,
        hasCoins: requirements?.hasCoins ?? false,
        hasIncome: requirements?.hasIncome ?? false,
        ready: requirements?.ready ?? false,
      }
    }),
  )
  const openNextLocation = useGame((state) => state.openNextLocation)

  if (!location) {
    return null
  }

  return (
    <Card size="sm" className="rounded-lg bg-muted/30">
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="min-w-0 sm:flex-1">
          <h2 className="truncate text-sm font-medium">Next location: {location.name}</h2>
          <p className="truncate text-xs text-muted-foreground">
            New items to stock · +{formatPercent(LOCATION_BONUS)} franchise bonus
          </p>
        </div>

        <div className="flex items-end justify-between gap-3 sm:contents">
          <div className="flex shrink-0 flex-col gap-1 text-xs tabular-nums">
            <p id="open-requirements" className="font-medium text-muted-foreground">
              Requirements
            </p>
            <ul aria-labelledby="open-requirements" className="flex flex-col gap-1">
              <RequirementLine met={hasIncome}>
                Income ₽{formatRate(location.requiredIncome)}/s
              </RequirementLine>
              <RequirementLine met={hasCoins}>
                ₽{formatMoney(location.openCost)} to open
              </RequirementLine>
            </ul>
          </div>
          <Button size="sm" disabled={!ready} onClick={openNextLocation} className="shrink-0">
            Open location<span className="sr-only">: {location.name}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
