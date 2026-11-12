import { useEffect } from 'react'
import { startAutosave } from './save'
import { useGame } from './store'

// Background tabs throttle rAF; cap a single step so a long pause isn't paid out
// all at once here (offline earnings will handle that explicitly later).
const MAX_STEP_SECONDS = 60

export function useGameLoop() {
  useEffect(() => {
    const stopAutosave = startAutosave()
    let last = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      // The first rAF timestamp can predate `last`, which would make a negative step.
      const seconds = Math.min(Math.max((now - last) / 1000, 0), MAX_STEP_SECONDS)
      last = now
      useGame.getState().tick(seconds)
      frame = requestAnimationFrame(step)
    })
    return () => {
      cancelAnimationFrame(frame)
      stopAutosave()
    }
  }, [])
}
