import { useEffect, useState } from 'react'

const STEP_MS = 3_500
const PIXELS_PER_SECOND = 60

interface Roaming {
  x: number
  facingLeft: boolean
  /** How long the walk to `x` takes, so the CSS transition matches the distance. */
  walkMs: number
}

/** Wanders left and right across the window, standing still for anyone who prefers reduced motion. */
export function useRoaming(width: number): Roaming {
  const [roaming, setRoaming] = useState<Roaming>({ x: 16, facingLeft: false, walkMs: 0 })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const timer = setInterval(() => {
      setRoaming((current) => {
        const x = Math.random() * Math.max(window.innerWidth - width, 0)
        const distance = Math.abs(x - current.x)

        return { x, facingLeft: x < current.x, walkMs: (distance / PIXELS_PER_SECOND) * 1000 }
      })
    }, STEP_MS)

    return () => clearInterval(timer)
  }, [width])

  return roaming
}
