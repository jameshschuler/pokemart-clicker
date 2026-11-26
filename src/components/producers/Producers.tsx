import { isLocationOpen } from '@/game/locations'
import { nextLockedProducer, PRODUCERS } from '@/game/producers'
import { useGame } from '@/game/store'
import { LockedProducerRow } from './LockedProducerRow'
import { ProducerRow } from './ProducerRow'

export function Producers() {
  const martsOwned = useGame((state) => state.martsOwned)
  const available = PRODUCERS.filter((producer) => isLocationOpen(producer.location, martsOwned))
  const locked = nextLockedProducer(martsOwned)

  return (
    <section className="flex flex-col gap-2">
      <h2 className="px-2 text-sm font-medium">Producers</h2>
      <ul className="flex flex-col gap-2">
        {available.map((producer) => (
          <li key={producer.id}>
            <ProducerRow producer={producer} />
          </li>
        ))}
        {locked && (
          <li>
            <LockedProducerRow producer={locked} />
          </li>
        )}
      </ul>
    </section>
  )
}
