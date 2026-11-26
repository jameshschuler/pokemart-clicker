import { useRef } from 'react'
import { LOCATIONS, nextLocation, shortLocationName } from '@/game/locations'
import { useGame } from '@/game/store'
import { cn } from '@/lib/utils'

const EDGE_INSET = `${50 / LOCATIONS.length}%`

/** Clicks on Celadon's dot that find the Eevee in Celadon Mansion. */
const MANSION_KNOCKS = 5

export function RouteMap() {
  const martsOwned = useGame((state) => state.martsOwned)
  const progress = (martsOwned - 1) / (LOCATIONS.length - 1)
  const upcoming = nextLocation(martsOwned)
  const findEevee = useGame((state) => state.findEevee)
  const mansionKnocks = useRef(0)

  function knockOnMansion() {
    mansionKnocks.current += 1
    if (mansionKnocks.current >= MANSION_KNOCKS) {
      findEevee()
    }
  }

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
          style={{ gridTemplateColumns: `repeat(${LOCATIONS.length}, minmax(0, 1fr))` }}
        >
          {LOCATIONS.map((location, index) => {
            const isOpen = index < martsOwned
            const isNext = location.id === upcoming?.id

            return (
              <li
                key={location.id}
                title={location.name}
                className="flex min-w-0 flex-col items-center gap-1.5"
              >
                <span
                  onClick={location.id === 'celadon' && isOpen ? knockOnMansion : undefined}
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
                  {shortLocationName(location)}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
