import { useShallow } from 'zustand/react/shallow'
import { useGame } from '@/game/store'
import { availableRegisterUpgrades, REGISTER_UPGRADES } from '@/game/upgrades'
import { RegisterUpgradeRow } from './RegisterUpgradeRow'

export function RegisterUpgrades() {
  const { registerUpgrades, martsOwned } = useGame(
    useShallow((state) => ({
      registerUpgrades: state.registerUpgrades,
      martsOwned: state.martsOwned,
    })),
  )
  const available = availableRegisterUpgrades(registerUpgrades, martsOwned)

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 px-3">
        <h2 className="text-sm font-medium">Register upgrades</h2>
        <span className="text-xs text-muted-foreground tabular-nums">
          {registerUpgrades.length}/{REGISTER_UPGRADES.length} owned
        </span>
      </div>

      {available.length > 0 && (
        <ul className="flex flex-col gap-1">
          {available.map((upgrade) => (
            <li key={upgrade.id}>
              <RegisterUpgradeRow upgrade={upgrade} />
            </li>
          ))}
        </ul>
      )}

      {available.length === 0 && (
        <p className="px-3 text-xs text-muted-foreground">No upgrades available right now.</p>
      )}
    </section>
  )
}
