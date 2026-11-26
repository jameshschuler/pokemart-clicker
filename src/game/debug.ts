import { CELADON_FLOORS, isLocationOpen, PLAYABLE_LOCATIONS } from './locations'
import { useGame } from './store'

/** Playtesting shortcuts behind the dev tools panel, in dev builds only. */
export const debugCommands = {
  addMoney(amount: number) {
    useGame.setState((state) => ({ coins: state.coins + amount }))
  },

  /** Opens marts in route order for free. Closing Celadon also closes its floors and loses Eevee. */
  openMarts(count: number = PLAYABLE_LOCATIONS) {
    const martsOwned = Math.min(Math.max(count, 1), PLAYABLE_LOCATIONS)
    const celadonOpen = isLocationOpen('celadon', martsOwned)

    useGame.setState((state) => ({
      martsOwned,
      floorsOpen: celadonOpen ? state.floorsOpen : 1,
      eevee: celadonOpen ? state.eevee : null,
    }))
  },

  /** Opens Department Store floors in order, without paying, once Celadon is open. */
  openFloors(count: number) {
    if (!isLocationOpen('celadon', useGame.getState().martsOwned)) {
      return
    }

    useGame.setState({ floorsOpen: Math.min(Math.max(count, 1), CELADON_FLOORS.length) })
  },

  /** Pretends the game was closed for `seconds`. Under 15 minutes counts as play time, with no report. */
  away(seconds: number) {
    useGame.getState().tick(seconds)
  },
}
