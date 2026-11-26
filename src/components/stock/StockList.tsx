import { useShallow } from 'zustand/react/shallow'
import { formatRate } from '@/game/format'
import { saleValue, stockBoard, stockOffers } from '@/game/stocking'
import { useGame } from '@/game/store'
import { NextFloorRow } from './NextFloorRow'
import { StockedItem } from './StockedItem'
import { StockTile } from './StockTile'

export function StockList() {
  const { martsOwned, floorsOpen, stockedItems } = useGame(
    useShallow((state) => ({
      martsOwned: state.martsOwned,
      floorsOpen: state.floorsOpen,
      stockedItems: state.stockedItems,
    })),
  )
  const { toStock, stocked } = stockBoard(
    stockOffers(martsOwned, floorsOpen),
    floorsOpen,
    stockedItems,
  )

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3 px-2">
        <h2 className="text-sm font-medium">Stock</h2>
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          ₽{formatRate(saleValue(stockedItems))} per sale
        </span>
      </div>

      {toStock.map((section) => (
        <div key={section.floor ?? 'franchise'} className="flex flex-col gap-1.5">
          <h3 className="px-2 text-xs font-medium text-muted-foreground">
            {section.floor ?? 'To stock'}
          </h3>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2">
            {section.offers.map((offer) => (
              <li key={offer.item.id}>
                <StockTile offer={offer} />
              </li>
            ))}
          </ul>
        </div>
      ))}

      {stocked.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <h3 className="px-2 text-xs font-medium text-muted-foreground">
            Stocked · {stocked.length}
          </h3>
          <ul className="flex flex-wrap gap-1 px-1">
            {stocked.map((offer) => (
              <li key={offer.item.id}>
                <StockedItem item={offer.item} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <NextFloorRow />
    </section>
  )
}
