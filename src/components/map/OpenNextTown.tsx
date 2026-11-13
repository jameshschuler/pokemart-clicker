import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MART_BONUS, openRequirements } from '@/game/economy'
import { formatMoney, formatPercent, formatRate } from '@/game/format'
import { itemNames } from '@/game/items'
import { useGame } from '@/game/store'
import { currentTown, newStock } from '@/game/towns'
import { RequirementLine } from './RequirementLine'

export function OpenNextTown() {
  const { town, hasCoins, hasSales, ready, newestMart, itemCount, missingCount } = useGame(
    useShallow((state) => {
      const requirements = openRequirements(state, state.coins)

      return {
        town: requirements?.town,
        hasCoins: requirements?.hasCoins ?? false,
        hasSales: requirements?.hasSales ?? false,
        ready: requirements?.ready ?? false,
        newestMart: currentTown(state.martsOwned).name,
        itemCount: currentTown(state.martsOwned).stock.length,
        missingCount: requirements?.missing.length ?? 0,
      }
    }),
  )
  const openNextTown = useGame((state) => state.openNextTown)

  if (!town) {
    return <p className="px-3 text-sm text-muted-foreground">Every mart in Kanto is open.</p>
  }

  const fresh = newStock(town)
  const unlocks = fresh.length > 0 ? `New: ${itemNames(fresh)}` : 'No new items, fresh prices'

  return (
    <Card size="sm" className="bg-muted/30 shadow-none">
      <CardContent className="flex flex-col gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Next stop: {town.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {unlocks} · +{formatPercent(MART_BONUS)} chain bonus
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <ul className="flex min-w-0 flex-1 flex-col gap-1 text-xs tabular-nums">
            <RequirementLine met={missingCount === 0}>
              Order every item in {newestMart} · {itemCount - missingCount}/{itemCount}
            </RequirementLine>
            <RequirementLine met={hasSales}>
              Chain sales ₽{formatRate(town.requiredSalesPerSecond)}/s
            </RequirementLine>
            <RequirementLine met={hasCoins}>₽{formatMoney(town.openCost)} to open</RequirementLine>
          </ul>
          <Button size="sm" disabled={!ready} onClick={openNextTown} className="shrink-0">
            Open mart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
