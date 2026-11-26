import { useShallow } from 'zustand/react/shallow'
import { ReadyIn } from '@/components/shared/ReadyIn'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { purchaseQuote, salesPerSecond, type BuyAmount } from '@/game/economy'
import { formatPrice } from '@/game/format'
import type { Producer } from '@/game/producers'
import { useGame } from '@/game/store'

interface BuyButtonProps {
  producer: Producer
  owned: number
  amount: BuyAmount
}

export function BuyButton({ producer, owned, amount }: BuyButtonProps) {
  // Subscribe to the quote, not raw coins, so buttons only re-render when it changes.
  const { count, cost, affordable, hasIncome } = useGame(
    useShallow((state) => {
      const quote = purchaseQuote(producer.baseCost, owned, state.coins, amount)

      return {
        ...quote,
        affordable: quote.cost <= state.coins,
        hasIncome: salesPerSecond(state.producers) > 0,
      }
    }),
  )
  const buyProducer = useGame((state) => state.buyProducer)
  const label = amount === 'max' ? `Max ×${count}` : `×${count}`
  const price = formatPrice(cost)

  return (
    <Tooltip disabled={affordable || !hasIncome}>
      <TooltipTrigger
        render={
          <Button
            size="sm"
            variant="ghost"
            disabled={!affordable}
            focusableWhenDisabled
            onClick={() => buyProducer(producer.id, amount)}
            aria-label={`Buy ${count} ${producer.name} for ${price}`}
            className="h-auto w-16 flex-col gap-0 px-1 py-1 tabular-nums aria-disabled:active:translate-y-0 aria-disabled:opacity-40 aria-disabled:hover:bg-transparent dark:aria-disabled:hover:bg-transparent"
          />
        }
      >
        <span className="text-xs font-medium">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">{price}</span>
      </TooltipTrigger>
      <TooltipContent>
        <ReadyIn cost={cost} className="text-background" />
      </TooltipContent>
    </Tooltip>
  )
}
