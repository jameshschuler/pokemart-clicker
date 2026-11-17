import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { REGISTER_UPGRADE_SHARE } from '@/game/economy'
import { formatMoney, formatPercent } from '@/game/format'
import { useGame } from '@/game/store'
import type { RegisterUpgrade } from '@/game/upgrades'
import { cn } from '@/lib/utils'

interface RegisterUpgradeRowProps {
  upgrade: RegisterUpgrade
}

export function RegisterUpgradeRow({ upgrade }: RegisterUpgradeRowProps) {
  const affordable = useGame((state) => state.coins >= upgrade.cost)
  const buyRegisterUpgrade = useGame((state) => state.buyRegisterUpgrade)

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            disabled={!affordable}
            focusableWhenDisabled
            onClick={() => buyRegisterUpgrade(upgrade.id)}
            className="h-auto w-full justify-between gap-3 px-3 py-2 text-left disabled:opacity-100"
          />
        }
      >
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{upgrade.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            +{formatPercent(REGISTER_UPGRADE_SHARE)} of income per click
          </span>
          <span className="sr-only">{upgrade.description}</span>
        </span>
        <span
          className={cn(
            'shrink-0 font-mono text-sm tabular-nums',
            affordable ? 'text-foreground' : 'text-muted-foreground/60',
          )}
        >
          ₽{formatMoney(upgrade.cost)}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-64">{upgrade.description}</TooltipContent>
    </Tooltip>
  )
}
