import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { chainMultiplier, shelfSales, type BuyAmount } from '@/game/economy'
import { formatRate } from '@/game/format'
import { ITEMS } from '@/game/items'
import { useGame } from '@/game/store'
import { stocks, townById } from '@/game/towns'
import { ItemRow } from './ItemRow'
import { OpenNextTown } from './OpenNextTown'
import { RestockStatus } from './RestockStatus'

const AMOUNTS: { value: BuyAmount; label: string }[] = [
  { value: 1, label: '×1' },
  { value: 10, label: '×10' },
  { value: 'max', label: 'Max' },
]

export function Store() {
  const [amount, setAmount] = useState<BuyAmount>(1)
  const selectedMart = useGame((state) => state.selectedMart)
  const martSales = useGame(
    (state) => shelfSales(state.marts[state.selectedMart]) * chainMultiplier(state),
  )
  const stock = ITEMS.filter((item) => stocks(selectedMart, item.id))

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-medium">{townById(selectedMart).name} Mart</h2>
          <p className="truncate text-xs text-muted-foreground tabular-nums">
            ₽{formatRate(martSales)} per second
          </p>
        </div>
        <div className="flex shrink-0 gap-1" role="group" aria-label="Buy amount">
          {AMOUNTS.map((option) => (
            <Button
              key={option.label}
              size="xs"
              variant={amount === option.value ? 'secondary' : 'ghost'}
              aria-pressed={amount === option.value}
              onClick={() => setAmount(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <RestockStatus />

      <ul className="flex flex-col gap-1">
        {stock.map((item) => (
          <li key={item.id}>
            <ItemRow item={item} amount={amount} />
          </li>
        ))}
      </ul>

      <OpenNextTown />
    </section>
  )
}
