import { incomePerSecond } from '@/game/economy'
import { formatRate } from '@/game/format'
import { PRODUCERS } from '@/game/producers'
import { useGame } from '@/game/store'
import { isTownOpen } from '@/game/towns'
import { ProducerRow } from './ProducerRow'

export function Producers() {
  const income = useGame((state) => incomePerSecond(state))
  const martsOwned = useGame((state) => state.martsOwned)
  const available = PRODUCERS.filter((producer) => isTownOpen(producer.town, martsOwned))

  return (
    <section className="flex flex-col gap-4">
      <div className="min-w-0">
        <h2 className="truncate text-base font-medium">PokéMart franchise</h2>
        <p className="truncate text-sm text-muted-foreground tabular-nums">
          ₽{formatRate(income)} per second
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {available.map((producer) => (
          <li key={producer.id}>
            <ProducerRow producer={producer} />
          </li>
        ))}
      </ul>
    </section>
  )
}
