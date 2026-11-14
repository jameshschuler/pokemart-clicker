import { AchievementsDialog } from '@/components/achievements/AchievementsDialog'
import { AchievementToast } from '@/components/achievements/AchievementToast'
import { WelcomeBackDialog } from '@/components/away/WelcomeBackDialog'
import { RouteMap } from '@/components/map/RouteMap'
import { Counter } from '@/components/register/Counter'
import { Producers } from '@/components/producers/Producers'
import { ResetSaveDialog } from '@/components/save/ResetSaveDialog'
import { StatsDialog } from '@/components/stats/StatsDialog'
import { StockList } from '@/components/stock/StockList'
import { useGame } from '@/game/store'
import { TOWNS } from '@/game/towns'
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
            Kanto franchise · {martsOwned} of {TOWNS.length} towns
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <AchievementsDialog />
          <StatsDialog />
          <ResetSaveDialog />
        </div>
      </header>

      <RouteMap />

      <main className="grid flex-1 content-start gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-8">
        <Counter />
        <div className="flex min-w-0 flex-col gap-6">
          <Producers />
          <StockList />
        </div>
      </main>

      <footer className="text-xs text-muted-foreground">
        Personal fan project, not for distribution. Not affiliated with Nintendo, Game Freak or The
        Pokémon Company. Pokémon and Pokémon character names are trademarks of Nintendo. Item
        sprites belong to their owners; sprites via PokeAPI.
      </footer>

      <AchievementToast />
      <WelcomeBackDialog />
    </div>
  )
}
