import { ReadyIn } from '@/components/shared/ReadyIn'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { bulkCost, producerIncome } from '@/game/economy'
import { formatRate } from '@/game/format'
import type { Producer } from '@/game/producers'
import { useGame } from '@/game/store'
import { BUY_AMOUNTS } from './buy-amounts'
import { BuyButton } from './BuyButton'
import { PRODUCER_ICONS } from './producer-icons'

interface ProducerRowProps {
  producer: Producer
}

export function ProducerRow({ producer }: ProducerRowProps) {
  const owned = useGame((state) => state.producers[producer.id])
  const eachPerSecond = useGame((state) => producerIncome(state, producer))
  const Icon = PRODUCER_ICONS[producer.id]

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/60">
      <div
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground"
      >
        <Icon className="size-6" />
      </div>
      <div className="flex min-w-32 flex-1 flex-col gap-0.5">
        <Tooltip>
          <TooltipTrigger className="min-w-0 truncate rounded-sm text-left text-base font-medium outline-none focus-visible:ring-1 focus-visible:ring-ring">
            {producer.name}
          </TooltipTrigger>
          <TooltipContent className="max-w-64">{producer.description}</TooltipContent>
        </Tooltip>
        <span className="truncate text-sm text-muted-foreground tabular-nums">
          ₽{formatRate(eachPerSecond)}/s each
        </span>
        <ReadyIn cost={bulkCost(producer.baseCost, owned, 1)} />
      </div>
      <div className="flex w-16 shrink-0 flex-col items-end gap-0.5 tabular-nums">
        <span className="font-mono text-2xl leading-none font-semibold">{owned}</span>
        <span className="text-xs text-muted-foreground">owned</span>
      </div>
      <div role="group" aria-label={`Buy ${producer.name}`} className="ml-auto flex shrink-0 gap-1">
        {BUY_AMOUNTS.map((amount) => (
          <BuyButton key={amount} producer={producer} owned={owned} amount={amount} />
        ))}
      </div>
    </div>
  )
}
