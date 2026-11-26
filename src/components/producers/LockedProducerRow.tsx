import { formatMoney } from '@/game/format'
import { locationById } from '@/game/locations'
import type { Producer } from '@/game/producers'

interface LockedProducerRowProps {
  producer: Producer
}

export function LockedProducerRow({ producer }: LockedProducerRowProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-dashed border-border px-4 py-3 text-muted-foreground">
      <div
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-lg font-semibold"
      >
        ?
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-medium">
          <span aria-hidden>???</span>
          <span className="sr-only">Locked producer</span>
        </span>
        <span className="truncate text-sm tabular-nums">
          ₽{formatMoney(producer.baseCost)} · Opens with {locationById(producer.location).name}
        </span>
      </div>
    </div>
  )
}
