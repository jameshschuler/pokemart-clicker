import { useGame } from '@/game/store'
import { WanderingEevee } from './WanderingEevee'

export function RoamingEevee() {
  const eevee = useGame((state) => state.eevee)

  return eevee ? <WanderingEevee form={eevee} /> : null
}
