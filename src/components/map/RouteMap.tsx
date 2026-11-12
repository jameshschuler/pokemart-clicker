import { useShallow } from 'zustand/react/shallow'
import { useGame } from '@/game/store'
import { TOWNS } from '@/game/towns'
import { cn } from '@/lib/utils'

const EDGE_INSET = `${50 / TOWNS.length}%`

export function RouteMap() {
  const { martsOwned, selectedMart, selectMart } = useGame(
    useShallow((state) => ({
      martsOwned: state.martsOwned,
      selectedMart: state.selectedMart,
      selectMart: state.selectMart,
    })),
  )
  const progress = (martsOwned - 1) / (TOWNS.length - 1)

  return (
    <nav aria-label="Kanto route" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="relative min-w-[640px]">
        <div
          aria-hidden
          className="absolute top-2.5 h-px bg-border"
          style={{ left: EDGE_INSET, right: EDGE_INSET }}
        />
        <div
          aria-hidden
          className="absolute top-2.5 h-px bg-foreground transition-[width] duration-500"
          style={{ left: EDGE_INSET, width: `calc((100% - 2 * ${EDGE_INSET}) * ${progress})` }}
        />
        <ol
          className="relative grid"
          style={{ gridTemplateColumns: `repeat(${TOWNS.length}, minmax(0, 1fr))` }}
        >
          {TOWNS.map((town, index) => {
            const isOpen = index < martsOwned
            const isNext = index === martsOwned
            const isSelected = town.id === selectedMart

            return (
              <li key={town.id} className="min-w-0">
                <button
                  type="button"
                  title={town.name}
                  disabled={!isOpen}
                  aria-current={isSelected ? 'page' : undefined}
                  onClick={() => selectMart(town.id)}
                  className="flex w-full min-w-0 flex-col items-center gap-1.5 rounded-md py-1 outline-none focus-visible:ring-1 focus-visible:ring-ring enabled:hover:bg-muted/50"
                >
                  <span
                    className={cn(
                      'size-3 rounded-full border-2 bg-background',
                      isOpen ? 'border-foreground bg-foreground' : 'border-border',
                      isNext && 'border-primary',
                      isSelected && 'ring-2 ring-ring/50',
                    )}
                  />
                  <span
                    className={cn(
                      'w-full truncate px-0.5 text-center text-[11px]',
                      isSelected ? 'font-medium text-foreground' : 'text-muted-foreground',
                      !isOpen && !isNext && 'text-muted-foreground/60',
                    )}
                  >
                    {town.name.replace(/ (Town|City|Island)$/, '')}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
