import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatPercent } from '@/game/format'
import { type Item, itemSpriteUrl } from '@/game/items'
import { stockBonus } from '@/game/stocking'

interface StockedItemProps {
  item: Item
}

export function StockedItem({ item }: StockedItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-ring">
        <img
          src={itemSpriteUrl(item)}
          alt={item.name}
          width={32}
          height={32}
          className="size-8 [image-rendering:pixelated]"
        />
      </TooltipTrigger>
      <TooltipContent className="flex max-w-64 flex-col gap-0.5">
        <span className="font-medium">{item.name}</span>
        <span className="tabular-nums">+{formatPercent(stockBonus(item))} sale value</span>
        <span className="text-background/70">{item.description}</span>
      </TooltipContent>
    </Tooltip>
  )
}
