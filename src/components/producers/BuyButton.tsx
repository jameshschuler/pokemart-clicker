import { useShallow } from 'zustand/react/shallow'
import { ReadyIn } from '@/components/shared/ReadyIn'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { purchaseQuote, salesPerSecond, type BuyAmount } from '@/game/economy'
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
  const price = `₽${formatMoney(Math.ceil(cost))}`

  return (
    <Tooltip disabled={affordable || !hasIncome}>
      <TooltipTrigger
        render={
          <Button
            size="sm"
            variant="outline"
            disabled={!affordable}
            focusableWhenDisabled
            onClick={() => buyProducer(producer.id, amount)}
            aria-label={`Buy ${count} ${producer.name} for ${price}`}
            className="h-auto w-24 flex-col items-stretch gap-0.5 px-3 py-1.5 tabular-nums aria-disabled:active:translate-y-0 aria-disabled:opacity-50 aria-disabled:hover:bg-background dark:aria-disabled:hover:bg-input/30"
          />
        }
      >
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-sm">{price}</span>
      </TooltipTrigger>
      <TooltipContent>
        <ReadyIn cost={cost} className="text-background" />
      </TooltipContent>
    </Tooltip>
  )
}
