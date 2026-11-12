import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import { purchaseQuote, type BuyAmount } from '@/game/economy'
import { formatMoney } from '@/game/format'
import type { Item } from '@/game/items'
import { useGame } from '@/game/store'

interface BuyButtonProps {
  item: Item
  owned: number
  amount: BuyAmount
}

export function BuyButton({ item, owned, amount }: BuyButtonProps) {
  // Subscribe to the quote, not raw coins, so buttons only re-render when it changes.
  const { count, cost, affordable } = useGame(
    useShallow((state) => {
      const quote = purchaseQuote(item.baseCost, owned, state.coins, amount)

      return { ...quote, affordable: quote.count > 0 && quote.cost <= state.coins }
    }),
  )
  const buyItem = useGame((state) => state.buyItem)
  const selectedMart = useGame((state) => state.selectedMart)
  const label = amount === 'max' ? `Max ×${count}` : `×${count}`
  const price = `₽${formatMoney(Math.ceil(cost))}`

  return (
    <Button
      size="xs"
      variant="outline"
      disabled={!affordable}
      onClick={() => buyItem(selectedMart, item.id, amount)}
      aria-label={`Buy ${count} ${item.name} for ${price}`}
      className="h-auto min-w-16 flex-col items-stretch gap-0 px-2 py-1 tabular-nums"
    >
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="font-mono">{price}</span>
    </Button>
  )
}
