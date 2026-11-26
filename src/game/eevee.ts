import type { ItemId } from './items'

export type Eeveelution = 'flareon' | 'vaporeon' | 'jolteon'

/** Eevee's form once found in Celadon Mansion. */
export type EeveeForm = 'eevee' | Eeveelution

interface Evolution {
  form: Eeveelution
  name: string
  stone: ItemId
  dexNumber: number
}

const EEVEE_DEX_NUMBER = 133

/** Gen 3 Eevee evolves with these three stones; the Leaf Stone does nothing for it. */
export const EVOLUTIONS: Evolution[] = [
  { form: 'flareon', name: 'Flareon', stone: 'fireStone', dexNumber: 136 },
  { form: 'vaporeon', name: 'Vaporeon', stone: 'waterStone', dexNumber: 134 },
  { form: 'jolteon', name: 'Jolteon', stone: 'thunderStone', dexNumber: 135 },
]

const EVOLUTION_BY_FORM = new Map(EVOLUTIONS.map((evolution) => [evolution.form, evolution]))

const POKEMON_SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export function evolutionFor(form: Eeveelution): Evolution | undefined {
  return EVOLUTION_BY_FORM.get(form)
}

export function eeveeSpriteUrl(form: EeveeForm): string {
  const dexNumber = form === 'eevee' ? EEVEE_DEX_NUMBER : evolutionFor(form)?.dexNumber

  return `${POKEMON_SPRITE_BASE}/${dexNumber}.png`
}

export function isEeveeForm(value: unknown): value is EeveeForm {
  return value === 'eevee' || EVOLUTION_BY_FORM.has(value as Eeveelution)
}
