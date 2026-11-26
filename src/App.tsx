import { AchievementsDialog } from '@/components/achievements/AchievementsDialog'
import { AchievementToast } from '@/components/achievements/AchievementToast'
import { WelcomeBackDialog } from '@/components/away/WelcomeBackDialog'
import { DevTools } from '@/components/devtools/DevTools'
import { RoamingEevee } from '@/components/eevee/RoamingEevee'
import { OpenNextLocation } from '@/components/map/OpenNextLocation'
import { RouteMap } from '@/components/map/RouteMap'
import { Producers } from '@/components/producers/Producers'
import { Counter } from '@/components/register/Counter'
import { ResetSaveDialog } from '@/components/save/ResetSaveDialog'
import { StatsDialog } from '@/components/stats/StatsDialog'
import { StockList } from '@/components/stock/StockList'
import { LOCATIONS } from '@/game/locations'
import { useGame } from '@/game/store'
import { useGameLoop } from '@/game/useGameLoop'

export default function App() {
  useGameLoop()
  const martsOwned = useGame((state) => state.martsOwned)

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <header className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold">PokéMart Clicker</h1>
          <p className="truncate text-sm text-muted-foreground tabular-nums">
            Kanto franchise · {martsOwned} of {LOCATIONS.length} locations
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <AchievementsDialog />
          <StatsDialog />
          <ResetSaveDialog />
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-4">
          <RouteMap />
          <OpenNextLocation />
        </div>

        <div className="grid content-start gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-8">
          <Counter />
          <div className="flex min-w-0 flex-col gap-6">
            <Producers />
            <StockList />
          </div>
        </div>
      </main>

      <footer className="text-xs text-muted-foreground">
        Personal fan project, not for distribution. Not affiliated with Nintendo, Game Freak or The
        Pokémon Company. Pokémon and Pokémon character names are trademarks of Nintendo. Item
        sprites belong to their owners; sprites via PokeAPI.
      </footer>

      <AchievementToast />
      <WelcomeBackDialog />
      <RoamingEevee />
      {import.meta.env.DEV && <DevTools />}
    </div>
  )
}
