import { AchievementsDialog } from '@/components/achievements/AchievementsDialog'
import { AchievementToast } from '@/components/achievements/AchievementToast'
import { RouteMap } from '@/components/map/RouteMap'
import { Counter } from '@/components/register/Counter'
import { Store } from '@/components/shop/Store'
import { StatsDialog } from '@/components/stats/StatsDialog'
import { Button } from '@/components/ui/button'
import { clearSave } from '@/game/save'
import { useGame } from '@/game/store'
import { TOWNS } from '@/game/towns'
import { useGameLoop } from '@/game/useGameLoop'

export default function App() {
  useGameLoop()
  const reset = useGame((state) => state.reset)
  const martsOwned = useGame((state) => state.martsOwned)

  function handleReset() {
    if (!confirm('Wipe your save and start over?')) {
      return
    }

    clearSave()
    reset()
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-6 p-4 sm:p-6">
      <header className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold">PokéMart Clicker</h1>
          <p className="truncate text-sm text-muted-foreground tabular-nums">
            Kanto chain · {martsOwned} of {TOWNS.length} marts
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <AchievementsDialog />
          <StatsDialog />
          <Button size="xs" variant="ghost" onClick={handleReset}>
            Reset save
          </Button>
        </div>
      </header>

      <RouteMap />

      <main className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Counter />
        <Store />
      </main>

      <footer className="text-xs text-muted-foreground">
        Personal fan project, not for distribution. Not affiliated with Nintendo, Game Freak or The
        Pokémon Company. Pokémon and Pokémon character names are trademarks of Nintendo. Item
        sprites belong to their owners; sprites via PokeAPI.
      </footer>

      <AchievementToast />
    </div>
  )
}
