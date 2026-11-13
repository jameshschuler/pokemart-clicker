import { useGame } from './store'
import { TOWNS } from './towns'

/** Console helpers for playtesting. Installed as `window.mart` in dev builds only. */
export const debugCommands = {
  addMoney(amount: number) {
    useGame.setState((state) => ({ coins: state.coins + amount }))
  },

  /** Opens marts in route order without paying or meeting requirements. */
  openMarts(count: number = TOWNS.length) {
    useGame.setState({ martsOwned: Math.min(Math.max(count, 1), TOWNS.length) })
  },

  /** Pretends the game was closed for `seconds`, up to the offline cap. Under 15 minutes counts as play time, with no report. */
  away(seconds: number) {
    useGame.getState().tick(seconds)
  },

  help() {
    return 'mart.addMoney(amount) · mart.openMarts(count = all) · mart.away(seconds)'
  },
}

declare global {
  interface Window {
    mart?: typeof debugCommands
  }
}

export function installDebugCommands() {
  window.mart = debugCommands
  console.info(`Debug commands: ${debugCommands.help()}`)
}
