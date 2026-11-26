import { useState } from 'react'
import { type EeveeForm, eeveeSpriteUrl } from '@/game/eevee'
import { useRoaming } from '@/hooks/useRoaming'
import { cn } from '@/lib/utils'
import { EvolveEeveeDialog } from './EvolveEeveeDialog'

const SPRITE_PX = 64

interface WanderingEeveeProps {
  form: EeveeForm
}

export function WanderingEevee({ form }: WanderingEeveeProps) {
  const { x, facingLeft, walkMs } = useRoaming(SPRITE_PX)
  const [evolving, setEvolving] = useState(false)

  const sprite = (
    <img
      src={eeveeSpriteUrl(form)}
      alt=""
      width={SPRITE_PX}
      height={SPRITE_PX}
      className={cn('size-16 [image-rendering:pixelated]', !facingLeft && '-scale-x-100')}
    />
  )

  return (
    <div
      className="pointer-events-none fixed bottom-0 left-0 z-30 transition-transform ease-linear"
      style={{ transform: `translateX(${x}px)`, transitionDuration: `${walkMs}ms` }}
    >
      {form === 'eevee' ? (
        <button
          type="button"
          aria-label="Eevee. Evolve it with a stone"
          onClick={() => setEvolving(true)}
          className="pointer-events-auto block cursor-pointer rounded-md outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {sprite}
        </button>
      ) : (
        sprite
      )}
      <EvolveEeveeDialog open={evolving} onOpenChange={setEvolving} />
    </div>
  )
}
