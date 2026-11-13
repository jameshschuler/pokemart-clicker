import { incomePerSecond } from '@/game/economy'
import { formatRate } from '@/game/format'
import { PRODUCERS } from '@/game/producers'
import { useGame } from '@/game/store'
import { ProducerRow } from './ProducerRow'

export function Producers() {
  const income = useGame((state) => incomePerSecond(state))

  return (
    <section className="flex flex-col gap-4">
      <div className="min-w-0">
        <h2 className="truncate text-base font-medium">PokéMart franchise</h2>
        <p className="truncate text-sm text-muted-foreground tabular-nums">
          ₽{formatRate(income)} per second
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {PRODUCERS.map((producer) => (
          <li key={producer.id}>
            <ProducerRow producer={producer} />
          </li>
        ))}
      </ul>
    </section>
  )
}
