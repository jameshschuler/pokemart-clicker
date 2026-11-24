import { isLocationOpen } from '@/game/locations'
import { PRODUCERS } from '@/game/producers'
import { useGame } from '@/game/store'
import { ProducerRow } from './ProducerRow'

export function Producers() {
  const martsOwned = useGame((state) => state.martsOwned)
  const available = PRODUCERS.filter((producer) => isLocationOpen(producer.location, martsOwned))

  return (
    <section className="flex flex-col gap-2">
      <h2 className="px-2 text-sm font-medium">Producers</h2>
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
