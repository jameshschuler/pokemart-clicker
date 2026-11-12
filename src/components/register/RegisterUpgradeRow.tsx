import { Button } from '@/components/ui/button'
import { formatMoney } from '@/game/format'
import { useGame } from '@/game/store'
import { describeEffect, type RegisterUpgrade } from '@/game/upgrades'
import { cn } from '@/lib/utils'

interface RegisterUpgradeRowProps {
  upgrade: RegisterUpgrade
}

export function RegisterUpgradeRow({ upgrade }: RegisterUpgradeRowProps) {
  const affordable = useGame((state) => state.coins >= upgrade.cost)
  const buyRegisterUpgrade = useGame((state) => state.buyRegisterUpgrade)

  return (
    <Button
      variant="ghost"
      disabled={!affordable}
      onClick={() => buyRegisterUpgrade(upgrade.id)}
      title={upgrade.description}
      className="h-auto w-full justify-between gap-3 px-3 py-2 text-left disabled:opacity-100"
    >
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{upgrade.name}</span>
        <span className="truncate text-xs font-normal text-muted-foreground">
          {describeEffect(upgrade.effect)}
        </span>
      </span>
      <span
        className={cn(
          'shrink-0 font-mono text-sm tabular-nums',
          affordable ? 'text-foreground' : 'text-muted-foreground/60',
        )}
      >
        ₽{formatMoney(upgrade.cost)}
      </span>
    </Button>
  )
}
