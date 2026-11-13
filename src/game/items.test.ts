import { describe, expect, it } from 'vitest'
import { ITEMS, itemNames, itemSpriteUrl } from './items'

describe('items', () => {
  it('have unique ids', () => {
    expect(new Set(ITEMS.map((item) => item.id)).size).toBe(ITEMS.length)
  })

  it('are listed in cost order', () => {
    for (let index = 1; index < ITEMS.length; index++) {
      expect(ITEMS[index].baseCost).toBeGreaterThanOrEqual(ITEMS[index - 1].baseCost)
    }
  })

  it('all earn something', () => {
    for (const item of ITEMS) {
      expect(item.salesPerSecond).toBeGreaterThan(0)
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

describe('itemNames', () => {
  it.each([
    [[], ''],
    [['potion'], 'Potion'],
    [['potion', 'pokeBall'], 'Potion, Poké Ball'],
  ] as const)('lists %j as "%s"', (itemIds, expected) => {
    expect(itemNames([...itemIds])).toBe(expected)
  })
})
