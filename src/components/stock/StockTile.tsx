import { ReadyIn } from '@/components/shared/ReadyIn'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatPercent, formatPrice } from '@/game/format'
import { itemSpriteUrl } from '@/game/items'
import { stockBonus, type StockOffer } from '@/game/stocking'
import { useGame } from '@/game/store'

interface StockTileProps {
  offer: StockOffer
}

export function StockTile({ offer }: StockTileProps) {
  const { item, cost } = offer
  const affordable = useGame((state) => state.coins >= cost)
  const stockItem = useGame((state) => state.stockItem)
  const price = formatPrice(cost)

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            disabled={!affordable}
            focusableWhenDisabled
            onClick={() => stockItem(item.id)}
            aria-label={`Stock ${item.name} for ${price}`}
            className="h-auto w-full flex-col gap-1 px-1 py-2 aria-disabled:active:translate-y-0 aria-disabled:opacity-50 aria-disabled:hover:bg-background dark:aria-disabled:hover:bg-input/30"
          />
        }
      >
        <img
          src={itemSpriteUrl(item)}
          alt=""
          width={32}
          height={32}
          className="size-8 [image-rendering:pixelated]"
        />
        <span className="max-w-full truncate font-mono text-xs tabular-nums">{price}</span>
      </TooltipTrigger>
      <TooltipContent className="flex max-w-64 flex-col gap-0.5">
        <span className="font-medium">{item.name}</span>
        <span className="tabular-nums">+{formatPercent(stockBonus(item))} sale value</span>
        <span className="text-background/70">{item.description}</span>
        <ReadyIn cost={cost} className="text-background/70" />
      </TooltipContent>
    </Tooltip>
  )
}
