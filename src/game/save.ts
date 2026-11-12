import { emptyAchievements, type EarnedAchievements } from './achievements'
import { SHELF_CAPACITY, type Marts } from './economy'
import { ITEMS } from './items'
import { initialState, useGame, type GameState } from './store'
import { isTownOpen, TOWNS, type TownId } from './towns'
import { REGISTER_UPGRADES } from './upgrades'

const UPGRADE_IDS = new Set(REGISTER_UPGRADES.map((upgrade) => upgrade.id))
const TOWN_IDS = new Set<TownId>(TOWNS.map((town) => town.id))

const SAVE_KEY = 'mart-clicker:save'
const SAVE_VERSION = 2
const AUTOSAVE_MS = 10_000

interface SaveFile {
  version: number
  savedAt: number
  state: GameState
}

export function saveGame() {
  const { coins, marts, martsOwned, selectedMart, registerUpgrades, stats, achievements } =
    useGame.getState()
  const file: SaveFile = {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    state: { coins, marts, martsOwned, selectedMart, registerUpgrades, stats, achievements },
  }
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(file))
  } catch {
    // Storage full or blocked; the game keeps running unsaved.
  }
}

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(Math.max(value, min), max)
    : fallback
}

/**
 * Fills in towns and items added since the save was written, drops items that no longer exist,
 * and caps shelves stocked before the 100-unit limit.
 */
function mergeMarts(saved: Partial<Marts>): Marts {
  return Object.fromEntries(
    TOWNS.map((town) => [
      town.id,
      Object.fromEntries(
        ITEMS.map((item) => [item.id, clamp(saved[town.id]?.[item.id], 0, SHELF_CAPACITY, 0)]),
      ),
    ]),
  ) as Marts
}

/** Keeps earned tiers for achievements that still exist; new ones start unearned. */
function mergeAchievements(saved: Partial<EarnedAchievements> = {}): EarnedAchievements {
  const base = emptyAchievements()

  return Object.fromEntries(
    Object.keys(base).map((achievementId) => [
      achievementId,
      saved[achievementId as keyof EarnedAchievements] ?? 0,
    ]),
  ) as EarnedAchievements
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) {
      return
    }

    const file = JSON.parse(raw) as SaveFile
    if (file.version !== SAVE_VERSION) {
      return
    }

    const base = initialState()
    const martsOwned = Math.floor(clamp(file.state.martsOwned, 1, TOWNS.length, 1))
    const selectedMart: TownId =
      TOWN_IDS.has(file.state.selectedMart) && isTownOpen(file.state.selectedMart, martsOwned)
        ? file.state.selectedMart
        : base.selectedMart
    useGame.setState({
      ...base,
      ...file.state,
      coins: clamp(file.state.coins, 0, Infinity, 0),
      martsOwned,
      selectedMart,
      marts: mergeMarts(file.state.marts),
      registerUpgrades: (file.state.registerUpgrades ?? []).filter((upgradeId) =>
        UPGRADE_IDS.has(upgradeId),
      ),
      stats: { ...base.stats, ...file.state.stats },
      achievements: mergeAchievements(file.state.achievements),
    })
  } catch {
    // Corrupt save; start fresh.
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    // Ignore.
  }
}

/** Autosaves on an interval and whenever the tab is hidden. Returns a cleanup. */
export function startAutosave(): () => void {
  const interval = setInterval(saveGame, AUTOSAVE_MS)
  const onHide = () => {
    if (document.visibilityState === 'hidden') {
      saveGame()
    }
  }
  document.addEventListener('visibilitychange', onHide)
  window.addEventListener('pagehide', saveGame)

  return () => {
    clearInterval(interval)
    document.removeEventListener('visibilitychange', onHide)
    window.removeEventListener('pagehide', saveGame)
  }
}
