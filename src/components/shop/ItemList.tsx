import type { Item } from '@/game/items'
import { ItemRow } from './ItemRow'

interface ItemListProps {
  items: Item[]
}

export function ItemList({ items }: ItemListProps) {
  return (
    <ul className="flex max-h-[min(36rem,65svh)] flex-col gap-2 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]">
      {items.map((item) => (
        <li key={item.id}>
          <ItemRow item={item} />
        </li>
      ))}
    </ul>
  )
}
