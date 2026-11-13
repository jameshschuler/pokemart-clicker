import { chainMultiplier, martSales } from '@/game/economy'
import { formatRate } from '@/game/format'
import { useGame } from '@/game/store'
import { storeFloors, storeItems, storeName, townById } from '@/game/towns'
import { OrderMilestones } from './OrderMilestones'
import { FloorTabs } from './FloorTabs'
import { ItemList } from './ItemList'

export function Store() {
  const selectedMart = useGame((state) => state.selectedMart)
  const salesPerSecond = useGame(
    (state) => martSales(state.marts[state.selectedMart]) * chainMultiplier(state),
  )
  const town = townById(selectedMart)
  const floors = storeFloors(town)

  return (
    <section className="flex flex-col gap-4">
      <div className="min-w-0">
        <h2 className="truncate text-base font-medium">{storeName(town)}</h2>
        <p className="truncate text-sm text-muted-foreground tabular-nums">
          ₽{formatRate(salesPerSecond)} per second
        </p>
      </div>

      <OrderMilestones />

      {floors ? <FloorTabs key={town.id} floors={floors} /> : <ItemList items={storeItems(town)} />}
    </section>
  )
}
