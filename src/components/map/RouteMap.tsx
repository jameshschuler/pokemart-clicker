import { useGame } from '@/game/store'
import { nextTown, shortTownName, TOWNS } from '@/game/towns'
import { cn } from '@/lib/utils'

const EDGE_INSET = `${50 / TOWNS.length}%`

export function RouteMap() {
  const martsOwned = useGame((state) => state.martsOwned)
  const progress = (martsOwned - 1) / (TOWNS.length - 1)
  const upcoming = nextTown(martsOwned)

  return (
    <nav aria-label="Kanto route" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="relative min-w-[640px]">
        <div
          aria-hidden
          className="absolute top-1.5 h-px bg-border"
          style={{ left: EDGE_INSET, right: EDGE_INSET }}
        />
        <div
          aria-hidden
          className="absolute top-1.5 h-px bg-foreground transition-[width] duration-500"
          style={{ left: EDGE_INSET, width: `calc((100% - 2 * ${EDGE_INSET}) * ${progress})` }}
        />
        <ol
          className="relative grid"
          style={{ gridTemplateColumns: `repeat(${TOWNS.length}, minmax(0, 1fr))` }}
        >
          {TOWNS.map((town, index) => {
            const isOpen = index < martsOwned
            const isNext = town.id === upcoming?.id

            return (
              <li
                key={town.id}
                title={town.name}
                className="flex min-w-0 flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    'size-3 rounded-full border-2 bg-background',
                    isOpen ? 'border-foreground bg-foreground' : 'border-border',
                    isNext && 'border-primary',
                  )}
                />
                <span
                  className={cn(
                    'w-full truncate px-0.5 text-center text-[11px]',
                    isOpen ? 'font-medium text-foreground' : 'text-muted-foreground',
                    !isOpen && !isNext && 'text-muted-foreground/60',
                  )}
                >
                  {shortTownName(town)}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
