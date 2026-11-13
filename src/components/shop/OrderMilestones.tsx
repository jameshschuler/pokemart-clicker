import { useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { MILESTONE_BONUS, milestoneLevel, ORDER_MILESTONES, smallestOrder } from '@/game/economy'
import { formatPercent } from '@/game/format'
import { useGame } from '@/game/store'
import { townById } from '@/game/towns'
import { cn } from '@/lib/utils'

const CELEBRATE_MS = 3_000

export function OrderMilestones() {
  const { selectedMart, level, smallest } = useGame(
    useShallow((state) => {
      const { stock } = townById(state.selectedMart)
      const orders = state.marts[state.selectedMart]

      return {
        selectedMart: state.selectedMart,
        level: milestoneLevel(orders, stock),
        smallest: smallestOrder(orders, stock),
      }
    }),
  )
  const [celebrating, setCelebrating] = useState(false)
  const previous = useRef({ selectedMart, level })

  useEffect(() => {
    const reached = previous.current.selectedMart === selectedMart && level > previous.current.level
    previous.current = { selectedMart, level }
    if (!reached) {
      return
    }

    setCelebrating(true)
    const timeout = setTimeout(() => setCelebrating(false), CELEBRATE_MS)

    return () => clearTimeout(timeout)
  }, [selectedMart, level])

  const next = ORDER_MILESTONES[level]
  const earned = formatPercent(MILESTONE_BONUS * level)

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-md bg-muted/30 px-3 py-2 text-xs tabular-nums transition-colors',
        celebrating && 'bg-primary/10',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">Order milestones</span>
        <span className={cn('text-muted-foreground', celebrating && 'font-medium text-foreground')}>
          {celebrating
            ? `Milestone reached! +${formatPercent(MILESTONE_BONUS)} chain bonus`
            : `+${earned} earned`}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="flex shrink-0"
          aria-label={`${level} of ${ORDER_MILESTONES.length} milestones`}
        >
          {ORDER_MILESTONES.map((milestone, index) => {
            const isReached = index < level

            return (
              <Tooltip key={milestone}>
                <TooltipTrigger className="flex h-5 items-center rounded-sm px-0.5 outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <span
                    className={cn(
                      'h-1.5 w-5 rounded-full transition-colors',
                      isReached ? 'bg-foreground' : 'bg-border hover:bg-muted-foreground/40',
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent className="tabular-nums">
                  {milestone} a day of each item · +{formatPercent(MILESTONE_BONUS)}
                  {isReached ? ' · reached' : ` · smallest order ${smallest}/${milestone}`}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
        <p className="min-w-0 flex-1 truncate text-right text-muted-foreground">
          {next === undefined
            ? 'Every milestone reached'
            : `Order ${next} a day of each item for +${formatPercent(MILESTONE_BONUS)} · smallest ${smallest}/${next}`}
        </p>
      </div>
    </div>
  )
}
