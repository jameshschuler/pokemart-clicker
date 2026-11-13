import { useRef, useState, type MouseEvent } from 'react'
import { Button } from '@/components/ui/button'
import { chainSalesPerSecond, clickValue } from '@/game/economy'
import { formatMoney } from '@/game/format'
import { useGame } from '@/game/store'
import { OpenNextTown } from '@/components/map/OpenNextTown'
import { Balance } from './Balance'
import { ChainBonus } from './ChainBonus'
import { RegisterUpgrades } from './RegisterUpgrades'

interface Popup {
  id: number
  x: number
  y: number
  text: string
}

const POPUP_MS = 800

export function Counter() {
  const perClick = useGame((state) =>
    clickValue(state.registerUpgrades, chainSalesPerSecond(state)),
  )
  const serveCustomer = useGame((state) => state.serveCustomer)
  const [popups, setPopups] = useState<Popup[]>([])
  const nextId = useRef(0)

  function handleServe(event: MouseEvent<HTMLButtonElement>) {
    const earned = serveCustomer()
    const rect = event.currentTarget.getBoundingClientRect()
    // Keyboard activation has no pointer position; float from the center instead.
    const fromPointer = event.detail > 0
    const popup: Popup = {
      id: nextId.current++,
      x: fromPointer ? event.clientX - rect.left : rect.width / 2,
      y: fromPointer ? event.clientY - rect.top : rect.height / 2,
      text: `+₽${formatMoney(earned)}`,
    }
    setPopups((shown) => [...shown, popup])
    setTimeout(() => setPopups((shown) => shown.filter((other) => other.id !== popup.id)), POPUP_MS)
  }

  return (
    <section className="flex min-w-0 flex-col gap-4">
      <Balance />

      <Button
        variant="outline"
        onClick={handleServe}
        className="relative h-48 w-full flex-col gap-2 overflow-hidden rounded-lg bg-muted/30 select-none active:scale-[0.98]"
      >
        <span className="font-mono text-5xl font-bold">₽</span>
        <span className="text-sm font-medium">Serve customer</span>
        <span className="text-xs text-muted-foreground">+₽{formatMoney(perClick)} per sale</span>
        {popups.map((popup) => (
          <span
            key={popup.id}
            aria-hidden
            className="pointer-events-none absolute animate-float-up font-mono text-sm font-semibold text-primary"
            style={{ left: popup.x, top: popup.y }}
          >
            {popup.text}
          </span>
        ))}
      </Button>

      <OpenNextTown />

      <RegisterUpgrades />

      <ChainBonus />
    </section>
  )
}
