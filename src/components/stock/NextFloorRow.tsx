import { ReadyIn } from '@/components/shared/ReadyIn'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/game/format'
import { nextFloor } from '@/game/locations'
import { useGame } from '@/game/store'

export function NextFloorRow() {
  const floor = useGame((state) => nextFloor(state.martsOwned, state.floorsOpen))
  const affordable = useGame(
    (state) => floor?.openCost !== undefined && state.coins >= floor.openCost,
  )
  const openNextFloor = useGame((state) => state.openNextFloor)

  if (!floor?.openCost) {
    return null
  }

  const price = formatPrice(floor.openCost)

  return (
    <div className="flex items-center gap-3 rounded-md border border-dashed border-border px-3 py-2">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">Open {floor.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {floor.stock.length} new items to stock
        </span>
        <ReadyIn cost={floor.openCost} />
      </div>
      <Button
        size="sm"
        variant="outline"
        disabled={!affordable}
        onClick={openNextFloor}
        aria-label={`Open ${floor.name} for ${price}`}
        className="shrink-0 font-mono tabular-nums"
      >
        {price}
      </Button>
    </div>
  )
}
