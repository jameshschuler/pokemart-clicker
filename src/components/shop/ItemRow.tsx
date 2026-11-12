import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import { chainMultiplier, purchaseQuote, SHELF_CAPACITY, type BuyAmount } from '@/game/economy'
import { formatMoney, formatRate } from '@/game/format'
import { itemSpriteUrl, type Item } from '@/game/items'
import { useGame } from '@/game/store'
import { cn } from '@/lib/utils'

interface ItemRowProps {
  item: Item
  amount: BuyAmount
}

export function ItemRow({ item, amount }: ItemRowProps) {
  const selectedMart = useGame((state) => state.selectedMart)
  const owned = useGame((state) => state.marts[state.selectedMart][item.id])
  const multiplier = useGame((state) => chainMultiplier(state))
  // Subscribe to the quote, not raw coins, so rows only re-render when it changes.
  const { count, cost, affordable } = useGame(
    useShallow((state) => {
      const quote = purchaseQuote(item.baseCost, owned, state.coins, amount)

      return { ...quote, affordable: quote.count > 0 && quote.cost <= state.coins }
    }),
  )
  const buyItem = useGame((state) => state.buyItem)
  const isFull = owned >= SHELF_CAPACITY

  return (
    <Button
      variant="ghost"
      disabled={!affordable}
      onClick={() => buyItem(selectedMart, item.id, amount)}
      title={item.description}
      className="h-auto w-full justify-between gap-3 px-3 py-2 text-left disabled:opacity-100"
    >
      <img
        src={itemSpriteUrl(item)}
        alt=""
        width={30}
        height={30}
        className="size-7.5 shrink-0 [image-rendering:pixelated]"
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium">
          {item.name}
          {amount !== 1 && !isFull && <span className="ml-1 text-muted-foreground">×{count}</span>}
        </span>
        <span className="truncate text-xs font-normal text-muted-foreground">
          ₽{formatRate(item.salesPerSecond * multiplier)}/s each
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-3">
        <span
          className={cn(
            'font-mono text-sm tabular-nums',
            affordable ? 'text-foreground' : 'text-muted-foreground/60',
          )}
        >
          {isFull ? 'Full' : `₽${formatMoney(Math.ceil(cost))}`}
        </span>
        <span className="w-8 text-right font-mono text-lg font-semibold tabular-nums text-muted-foreground">
          {owned}
        </span>
      </span>
    </Button>
  )
}
