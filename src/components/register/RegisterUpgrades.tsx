import { useShallow } from 'zustand/react/shallow'
import { useGame } from '@/game/store'
import { isTownOpen, townById } from '@/game/towns'
import { REGISTER_UPGRADES } from '@/game/upgrades'
import { RegisterUpgradeRow } from './RegisterUpgradeRow'

export function RegisterUpgrades() {
  const { martsOwned, registerUpgrades } = useGame(
    useShallow((state) => ({ martsOwned: state.martsOwned, registerUpgrades: state.registerUpgrades })),
  )
  const owned = new Set(registerUpgrades)
  const notOwned = REGISTER_UPGRADES.filter((upgrade) => !owned.has(upgrade.id))
  const available = notOwned.filter((upgrade) => isTownOpen(upgrade.town, martsOwned))
  const nextLocked = notOwned.find((upgrade) => !isTownOpen(upgrade.town, martsOwned))

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 px-3">
        <h2 className="text-sm font-medium">Register upgrades</h2>
        <span className="text-xs text-muted-foreground tabular-nums">
          {owned.size}/{REGISTER_UPGRADES.length} owned
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

      {nextLocked && (
        <p className="px-3 text-xs text-muted-foreground">
          Next upgrade opens with {townById(nextLocked.town).name}
        </p>
      )}

      {notOwned.length === 0 && (
        <p className="px-3 text-xs text-muted-foreground">Every register upgrade owned.</p>
      )}
    </section>
  )
}
