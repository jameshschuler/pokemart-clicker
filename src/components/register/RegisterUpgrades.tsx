import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/shared/SectionCard'
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
    <SectionCard
      title="Register upgrades"
      flush
      action={
        <span className="text-xs text-muted-foreground">
          {registerUpgrades.length}/{REGISTER_UPGRADES.length} owned
        </span>
      }
    >
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
        <p className="px-(--card-spacing) text-xs text-muted-foreground">
          No upgrades available right now.
        </p>
      )}
    </SectionCard>
  )
}
