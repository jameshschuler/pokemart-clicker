import { describe, expect, it } from 'vitest'
import { eeveeSpriteUrl, isEeveeForm } from './eevee'

describe('eeveeSpriteUrl', () => {
  it.each([
    ['eevee', '133'],
    ['vaporeon', '134'],
    ['jolteon', '135'],
    ['flareon', '136'],
  ] as const)('shows %s as Pokédex number %s', (form, dexNumber) => {
    expect(eeveeSpriteUrl(form)).toMatch(new RegExp(`/${dexNumber}\\.png$`))
  })
})

describe('isEeveeForm', () => {
  it.each([
    ['eevee', true],
    ['flareon', true],
    ['umbreon', false],
    [null, false],
    [7, false],
  ])('%s is a form: %s', (value, expected) => {
    expect(isEeveeForm(value)).toBe(expected)
  })
})
