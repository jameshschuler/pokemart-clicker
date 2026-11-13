import { describe, expect, it } from 'vitest'
import { ITEMS, itemSpriteUrl } from './items'

describe('items', () => {
  it('have unique ids', () => {
    expect(new Set(ITEMS.map((item) => item.id)).size).toBe(ITEMS.length)
  })

  it('all have a real shop price', () => {
    for (const item of ITEMS) {
      expect(item.price).toBeGreaterThanOrEqual(100)
    }
  })
})

describe('item sprites', () => {
  it('point at PokeAPI item sprites', () => {
    for (const item of ITEMS) {
      expect(itemSpriteUrl(item)).toMatch(
        /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/.+\/[a-z-]+\.png$/,
      )
    }
  })

  it('give each item its own sprite, except TMs which share their type', () => {
    const nonTms = ITEMS.filter((item) => !item.name.startsWith('TM'))

    expect(new Set(nonTms.map(itemSpriteUrl)).size).toBe(nonTms.length)
  })
})
