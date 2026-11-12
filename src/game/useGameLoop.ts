import { useEffect } from 'react'
import { startAutosave } from './save'
import { useGame } from './store'

export function useGameLoop() {
  useEffect(() => {
    const stopAutosave = startAutosave()
    // Wall-clock time, unlike the rAF timestamp, keeps counting while the machine sleeps.
    let frame = requestAnimationFrame(function step() {
      useGame.getState().advanceTo(Date.now())
      frame = requestAnimationFrame(step)
    })
    return () => {
      cancelAnimationFrame(frame)
      stopAutosave()
    }
  }, [])
}
