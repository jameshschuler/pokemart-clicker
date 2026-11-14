import { emptyAchievements, type EarnedAchievements } from './achievements'
import type { Producers } from './economy'
import type { ItemId } from './items'
import { PRODUCERS } from './producers'
import { stockOffers } from './stocking'
import { initialState, useGame, type GameState } from './store'
import { PLAYABLE_TOWNS } from './towns'
import { REGISTER_UPGRADES } from './upgrades'

const UPGRADE_IDS = new Set(REGISTER_UPGRADES.map((upgrade) => upgrade.id))

const SAVE_KEY = 'mart-clicker:save'
const SAVE_VERSION = 4
const AUTOSAVE_MS = 10_000

interface SaveFile {
  version: number
  savedAt: number
  state: GameState
}

export function saveGame() {
  const {
    coins,
    producers,
    stockedItems,
    martsOwned,
    registerUpgrades,
    stats,
    achievements,
    paidUntil,
  } = useGame.getState()
  const file: SaveFile = {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    state: {
      coins,
      producers,
      stockedItems,
      martsOwned,
      registerUpgrades,
      stats,
      achievements,
      paidUntil,
    },
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

/** Fills in producers added since the save was written and drops ones that no longer exist. */
function mergeProducers(saved: Partial<Producers> = {}): Producers {
  return Object.fromEntries(
    PRODUCERS.map((producer) => [producer.id, clamp(saved[producer.id], 0, Infinity, 0)]),
  ) as Producers
}

/** Keeps stocked items the loaded franchise could have stocked, once each. */
function mergeStockedItems(saved: unknown, martsOwned: number): ItemId[] {
  if (!Array.isArray(saved)) {
    return []
  }

  const stockable = new Set<unknown>(stockOffers(martsOwned).map((offer) => offer.item.id))

  return [...new Set(saved)].filter((itemId): itemId is ItemId => stockable.has(itemId))
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
    const martsOwned = Math.floor(clamp(file.state.martsOwned, 1, PLAYABLE_TOWNS, 1))
    const now = Date.now()
    const savedAt = clamp(file.savedAt, 0, now, now)

    useGame.setState({
      ...base,
      ...file.state,
      coins: clamp(file.state.coins, 0, Infinity, 0),
      martsOwned,
      producers: mergeProducers(file.state.producers),
      stockedItems: mergeStockedItems(file.state.stockedItems, martsOwned),
      registerUpgrades: (file.state.registerUpgrades ?? []).filter((upgradeId) =>
        UPGRADE_IDS.has(upgradeId),
      ),
      stats: { ...base.stats, ...file.state.stats },
      achievements: mergeAchievements(file.state.achievements),
      paidUntil: clamp(file.state.paidUntil, 0, now, savedAt),
    })

    useGame.getState().advanceTo(now)
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
