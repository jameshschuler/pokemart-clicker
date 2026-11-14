import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatMoney, formatPercent } from '@/game/format'
import { itemSpriteUrl } from '@/game/items'
import { stockBonus, type StockOffer } from '@/game/stocking'
import { useGame } from '@/game/store'

interface StockRowProps {
  offer: StockOffer
  stocked: boolean
}

export function StockRow({ offer, stocked }: StockRowProps) {
  const { item, cost } = offer
  const affordable = useGame((state) => state.coins >= cost)
  const stockItem = useGame((state) => state.stockItem)

  return (
    <div className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50">
      <img
        src={itemSpriteUrl(item)}
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0 [image-rendering:pixelated]"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Tooltip>
          <TooltipTrigger className="min-w-0 truncate rounded-sm text-left text-sm font-medium outline-none focus-visible:ring-1 focus-visible:ring-ring">
            {item.name}
          </TooltipTrigger>
          <TooltipContent className="max-w-64">{item.description}</TooltipContent>
        </Tooltip>
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          +{formatPercent(stockBonus(item))} sale value
        </span>
      </div>
      {stocked ? (
        <span className="shrink-0 px-3 text-xs text-muted-foreground">Stocked</span>
      ) : (
        <Button
          size="sm"
          variant="outline"
          disabled={!affordable}
          onClick={() => stockItem(item.id)}
          aria-label={`Stock ${item.name} for ₽${formatMoney(cost)}`}
          className="shrink-0 font-mono tabular-nums"
        >
          ₽{formatMoney(cost)}
        </Button>
      )}
    </div>
  )
}
