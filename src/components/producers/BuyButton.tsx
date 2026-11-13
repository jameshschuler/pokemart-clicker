import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import { purchaseQuote, type BuyAmount } from '@/game/economy'
import { formatMoney } from '@/game/format'
import type { Producer } from '@/game/producers'
import { useGame } from '@/game/store'

interface BuyButtonProps {
  producer: Producer
  owned: number
  amount: BuyAmount
}

export function BuyButton({ producer, owned, amount }: BuyButtonProps) {
  // Subscribe to the quote, not raw coins, so buttons only re-render when it changes.
  const { count, cost, affordable } = useGame(
    useShallow((state) => {
      const quote = purchaseQuote(producer.baseCost, owned, state.coins, amount)

      return { ...quote, affordable: quote.cost <= state.coins }
    }),
  )
  const buyProducer = useGame((state) => state.buyProducer)
  const label = amount === 'max' ? `Max ×${count}` : `×${count}`
  const price = `₽${formatMoney(Math.ceil(cost))}`

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={!affordable}
      onClick={() => buyProducer(producer.id, amount)}
      aria-label={`Buy ${count} ${producer.name} for ${price}`}
      className="h-auto min-w-20 flex-col items-stretch gap-0.5 px-3 py-1.5 tabular-nums"
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-sm">{price}</span>
    </Button>
  )
}
