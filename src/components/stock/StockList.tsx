import { formatRate } from '@/game/format'
import { saleValue, stockOffers } from '@/game/stocking'
import { useGame } from '@/game/store'
import { nextTown } from '@/game/towns'
import { StockRow } from './StockRow'

export function StockList() {
  const martsOwned = useGame((state) => state.martsOwned)
  const stockedItems = useGame((state) => state.stockedItems)
  const stocked = new Set(stockedItems)
  const offers = stockOffers(martsOwned)
  const upcoming = nextTown(martsOwned)

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 px-2">
        <h2 className="text-sm font-medium">Stock</h2>
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          ₽{formatRate(saleValue(stockedItems))} per sale
        </span>
      </div>
      {offers.length > 0 && (
        <ul className="flex flex-col">
          {offers.map((offer) => (
            <li key={offer.item.id}>
              <StockRow offer={offer} stocked={stocked.has(offer.item.id)} />
            </li>
          ))}
        </ul>
      )}
      {upcoming && (
        <p className="px-2 text-xs text-muted-foreground">
          Open {upcoming.name} to stock its new items.
        </p>
      )}
    </section>
  )
}
