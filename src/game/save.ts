import { type EarnedAchievements, emptyAchievements } from './achievements'
import { isEeveeForm } from './eevee'
import type { Producers } from './economy'
import type { ItemId } from './items'
import { CELADON_FLOORS, isLocationOpen, PLAYABLE_LOCATIONS } from './locations'
import { PRODUCERS } from './producers'
import { stockOffers } from './stocking'
import { type GameState, initialState, useGame } from './store'
import { type RegisterUpgradeId, unlockedRegisterUpgrades } from './upgrades'

const SAVE_KEY = 'mart-clicker:save'
const SAVE_VERSION = 5
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
    floorsOpen,
    eevee,
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
      floorsOpen,
      eevee,
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
function mergeStockedItems(saved: unknown, martsOwned: number, floorsOpen: number): ItemId[] {
  if (!Array.isArray(saved)) {
    return []
  }

  const stockable = new Set<unknown>(
    stockOffers(martsOwned, floorsOpen).map((offer) => offer.item.id),
  )

  return [...new Set(saved)].filter((itemId): itemId is ItemId => stockable.has(itemId))
}

/** Keeps register upgrades the loaded franchise could have bought, once each. */
function mergeRegisterUpgrades(saved: unknown, martsOwned: number): RegisterUpgradeId[] {
  if (!Array.isArray(saved)) {
    return []
  }

  const savedIds = new Set(saved)

  return unlockedRegisterUpgrades(martsOwned)
    .filter((upgrade) => savedIds.has(upgrade.id))
    .map((upgrade) => upgrade.id)
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
    const martsOwned = Math.floor(clamp(file.state.martsOwned, 1, PLAYABLE_LOCATIONS, 1))
    const celadonOpen = isLocationOpen('celadon', martsOwned)
    const maxFloors = celadonOpen ? CELADON_FLOORS.length : 1
    const floorsOpen = Math.floor(clamp(file.state.floorsOpen, 1, maxFloors, 1))
    const now = Date.now()
    const savedAt = clamp(file.savedAt, 0, now, now)

    useGame.setState({
      ...base,
      ...file.state,
      coins: clamp(file.state.coins, 0, Infinity, 0),
      martsOwned,
      floorsOpen,
      eevee: celadonOpen && isEeveeForm(file.state.eevee) ? file.state.eevee : null,
      producers: mergeProducers(file.state.producers),
      stockedItems: mergeStockedItems(file.state.stockedItems, martsOwned, floorsOpen),
      registerUpgrades: mergeRegisterUpgrades(file.state.registerUpgrades, martsOwned),
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
