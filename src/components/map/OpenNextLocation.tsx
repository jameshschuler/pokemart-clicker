import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LOCATION_BONUS, openRequirements } from '@/game/economy'
import { formatMoney, formatPercent, formatRate } from '@/game/format'
import { shortLocationName } from '@/game/locations'
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
    <Card size="sm" className="bg-muted/30 shadow-none">
      <CardContent className="flex flex-col gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Next location: {location.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            New items to stock · +{formatPercent(LOCATION_BONUS)} franchise bonus
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1 text-xs tabular-nums">
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
            Open {shortLocationName(location)}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
