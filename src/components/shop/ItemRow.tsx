import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { chainMultiplier, SHELF_CAPACITY } from '@/game/economy'
import { formatRate } from '@/game/format'
import { itemSpriteUrl, type Item } from '@/game/items'
import { useGame } from '@/game/store'
import { BUY_AMOUNTS } from './buy-amounts'
import { BuyButton } from './BuyButton'

interface ItemRowProps {
  item: Item
}

export function ItemRow({ item }: ItemRowProps) {
  const owned = useGame((state) => state.marts[state.selectedMart][item.id])
  const multiplier = useGame((state) => chainMultiplier(state))

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg px-3 py-2 hover:bg-muted/50">
      <img
        src={itemSpriteUrl(item)}
        alt=""
        width={30}
        height={30}
        className="size-7.5 shrink-0 [image-rendering:pixelated]"
      />
      <div className="flex min-w-28 flex-1 flex-col">
        <Tooltip>
          <TooltipTrigger className="min-w-0 truncate rounded-sm text-left text-sm font-medium outline-none focus-visible:ring-1 focus-visible:ring-ring">
            {item.name}
          </TooltipTrigger>
          <TooltipContent className="max-w-64">{item.description}</TooltipContent>
        </Tooltip>
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          ₽{formatRate(item.salesPerSecond * multiplier)}/s each
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end tabular-nums">
        <span className="font-mono text-lg leading-none font-semibold">{owned}</span>
        <span className="text-[11px] text-muted-foreground">
          /{SHELF_CAPACITY}
          <span className="sr-only"> on the shelf</span>
        </span>
      </div>
      {owned >= SHELF_CAPACITY ? (
        <span className="ml-auto shrink-0 text-sm text-muted-foreground">Full</span>
      ) : (
        <div role="group" aria-label={`Buy ${item.name}`} className="ml-auto flex shrink-0 gap-1">
          {BUY_AMOUNTS.map((amount) => (
            <BuyButton key={amount} item={item} owned={owned} amount={amount} />
          ))}
        </div>
      )}
    </div>
  )
}
