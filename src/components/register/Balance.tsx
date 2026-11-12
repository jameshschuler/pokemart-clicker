import { useState } from 'react'
import { chainSalesPerSecond } from '@/game/economy'
import { formatMoney, formatRate, formatWholeMoney } from '@/game/format'
import { useGame } from '@/game/store'

export function Balance() {
  const coins = useGame((state) => state.coins)
  const perSecond = useGame((state) => chainSalesPerSecond(state))
  const [showWhole, setShowWhole] = useState(false)

  return (
    <div className="min-w-0">
      <button
        type="button"
        aria-pressed={showWhole}
        title={showWhole ? 'Show short amount' : 'Show full amount'}
        onClick={() => setShowWhole((whole) => !whole)}
        className="block max-w-full truncate rounded-md text-left font-mono text-3xl font-semibold tabular-nums outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        ₽{showWhole ? formatWholeMoney(coins) : formatMoney(coins)}
      </button>
      <p className="text-sm text-muted-foreground tabular-nums">
        ₽{formatRate(perSecond)} per second
      </p>
    </div>
  )
}
