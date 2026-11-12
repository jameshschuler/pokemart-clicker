import { describe, expect, it } from 'vitest'
import { ITEMS, itemNames, itemSpriteUrl } from './items'

describe('item sprites', () => {
  it('gives every item its own PokeAPI sprite', () => {
    const urls = new Set(ITEMS.map(itemSpriteUrl))

    expect(urls.size).toBe(ITEMS.length)
    for (const url of urls) {
      expect(url).toMatch(
        /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/.+\/[a-z-]+\.png$/,
      )
    }
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
