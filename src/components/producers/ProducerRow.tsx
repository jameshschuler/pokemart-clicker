import { ReadyIn } from '@/components/shared/ReadyIn'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { bulkCost, producerIncome } from '@/game/economy'
import { formatPrice, formatRate } from '@/game/format'
import type { Producer } from '@/game/producers'
import { useGame } from '@/game/store'
import { cn } from '@/lib/utils'
import { BULK_AMOUNTS } from './buy-amounts'
import { BuyButton } from './BuyButton'
import { PRODUCER_ART } from './producer-icons'

interface ProducerRowProps {
  producer: Producer
}

export function ProducerRow({ producer }: ProducerRowProps) {
  const owned = useGame((state) => state.producers[producer.id])
  const eachPerSecond = useGame((state) => producerIncome(state, producer))
  const cost = bulkCost(producer.baseCost, owned, 1)
  const affordable = useGame((state) => state.coins >= cost)
  const buyProducer = useGame((state) => state.buyProducer)
  const { icon: Icon, tint } = PRODUCER_ART[producer.id]
  const price = formatPrice(cost)

  return (
    <div
      className={cn(
        'relative flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-muted/30 px-4 py-3 transition-colors has-[[data-buy]:focus-visible]:ring-1 has-[[data-buy]:focus-visible]:ring-ring',
        affordable && 'hover:bg-muted/60',
      )}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              data-buy
              aria-disabled={!affordable}
              onClick={() => buyProducer(producer.id, 1)}
              className={cn(
                'flex min-w-48 flex-1 items-center gap-4 text-left outline-none after:absolute after:inset-0 after:rounded-lg',
                affordable ? 'cursor-pointer active:after:bg-muted/40' : 'cursor-default',
              )}
            />
          }
        >
          <span
            aria-hidden
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-md border transition-colors',
              affordable ? tint : 'border-border bg-background text-muted-foreground/60',
            )}
          >
            <Icon className="size-6" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-base leading-tight font-medium text-pretty">
              <span className="sr-only">Buy 1 </span>
              {producer.name}
            </span>
            <span className="truncate text-sm text-muted-foreground tabular-nums">
              <span className={cn('font-mono', affordable && 'text-foreground')}>{price}</span> · ₽
              {formatRate(eachPerSecond)}/s each
            </span>
            <ReadyIn cost={cost} />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-64">{producer.description}</TooltipContent>
      </Tooltip>

      <div className="ml-auto flex shrink-0 items-center gap-4">
        <div
          role="group"
          aria-label={`Buy more ${producer.plural}`}
          className="relative z-10 flex gap-1"
        >
          {BULK_AMOUNTS.map((amount) => (
            <BuyButton key={amount} producer={producer} owned={owned} amount={amount} />
          ))}
        </div>

        <span className="w-14 text-right font-mono text-3xl font-semibold text-muted-foreground tabular-nums">
          {owned}
          <span className="sr-only"> owned</span>
        </span>
      </div>
    </div>
  )
}
