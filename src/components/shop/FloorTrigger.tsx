import { TabsTrigger } from '@/components/ui/tabs'
import type { FloorSection } from '@/game/towns'
import { useGame } from '@/game/store'

interface FloorTriggerProps {
  floor: FloorSection
}

export function FloorTrigger({ floor }: FloorTriggerProps) {
  const unordered = useGame(
    (state) => floor.items.filter((item) => state.marts[state.selectedMart][item.id] === 0).length,
  )

  return (
    <TabsTrigger
      value={floor.name}
      className="h-auto flex-none flex-col items-start gap-0 px-2.5 py-2 text-left whitespace-normal"
    >
      <span>{floor.name}</span>
      <span className="text-xs font-normal text-muted-foreground tabular-nums">
        {unordered > 0 ? `${unordered} to order` : `${floor.items.length} items`}
      </span>
    </TabsTrigger>
  )
}
