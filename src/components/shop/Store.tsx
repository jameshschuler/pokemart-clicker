import { chainMultiplier, shelfSales } from '@/game/economy'
import { formatRate } from '@/game/format'
import { ITEMS } from '@/game/items'
import { useGame } from '@/game/store'
import { stocks, townById } from '@/game/towns'
import { ItemRow } from './ItemRow'
import { OpenNextTown } from './OpenNextTown'
import { RestockStatus } from './RestockStatus'

export function Store() {
  const selectedMart = useGame((state) => state.selectedMart)
  const martSales = useGame(
    (state) => shelfSales(state.marts[state.selectedMart]) * chainMultiplier(state),
  )
  const stock = ITEMS.filter((item) => stocks(selectedMart, item.id))

  return (
    <section className="flex flex-col gap-3">
      <div className="min-w-0">
        <h2 className="truncate text-sm font-medium">{townById(selectedMart).name} Mart</h2>
        <p className="truncate text-xs text-muted-foreground tabular-nums">
          ₽{formatRate(martSales)} per second
        </p>
      </div>

      <RestockStatus />

      <ul className="flex flex-col gap-1">
        {stock.map((item) => (
          <li key={item.id}>
            <ItemRow item={item} />
          </li>
        ))}
      </ul>

      <OpenNextTown />
    </section>
  )
}
