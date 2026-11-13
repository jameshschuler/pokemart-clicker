import { useGame } from '@/game/store'
import { nextRegisterUpgrade, REGISTER_UPGRADES } from '@/game/upgrades'
import { RegisterUpgradeRow } from './RegisterUpgradeRow'

export function RegisterUpgrades() {
  const registerUpgrades = useGame((state) => state.registerUpgrades)
  const next = nextRegisterUpgrade(registerUpgrades)

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 px-3">
        <h2 className="text-sm font-medium">Register upgrades</h2>
        <span className="text-xs text-muted-foreground tabular-nums">
          {registerUpgrades.length}/{REGISTER_UPGRADES.length} owned
        </span>
      </div>

      {next ? (
        <RegisterUpgradeRow upgrade={next} />
      ) : (
        <p className="px-3 text-xs text-muted-foreground">Every register upgrade owned.</p>
      )}
    </section>
  )
}
