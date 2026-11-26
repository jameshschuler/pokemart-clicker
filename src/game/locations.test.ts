import { describe, expect, it } from 'vitest'
import { ITEMS } from './items'
import {
  isLocationOpen,
  locationById,
  LOCATIONS,
  newStock,
  nextFloor,
  nextLocation,
  openStock,
  PLAYABLE_LOCATIONS,
  shortFloorName,
  shortLocationName,
  storeFloors,
  storeItems,
  storeName,
} from './locations'

describe('route data', () => {
  it('costs more to open each location than the last', () => {
    for (let index = 1; index < LOCATIONS.length; index++) {
      expect(LOCATIONS[index].openCost).toBeGreaterThan(LOCATIONS[index - 1].openCost)
      expect(LOCATIONS[index].requiredIncome).toBeGreaterThan(LOCATIONS[index - 1].requiredIncome)
    }
  })

  it('sells every item in at least one mart', () => {
    const sold = new Set(LOCATIONS.flatMap((location) => location.stock))

    for (const item of ITEMS) {
      expect(sold).toContain(item.id)
    }
  })
})

describe('isLocationOpen', () => {
  it.each([
    ['pallet', 1, true],
    ['viridian', 1, false],
    ['viridian', 2, true],
    ['indigoPlateau', 10, false],
    ['indigoPlateau', 11, true],
  ] as const)('%s with %i marts → %s', (locationId, martsOwned, expected) => {
    expect(isLocationOpen(locationId, martsOwned)).toBe(expected)
  })
})

describe('Celadon Department Store', () => {
  it('sells every item an earlier mart sells', () => {
    const celadon = new Set(locationById('celadon').stock)
    const earlier = LOCATIONS.slice(
      0,
      LOCATIONS.findIndex((location) => location.id === 'celadon'),
    )

    for (const location of earlier) {
      for (const itemId of location.stock) {
        expect(celadon.has(itemId), `${itemId} from ${location.name}`).toBe(true)
      }
    }
  })
})

describe('storeName', () => {
  it.each([
    ['pallet', 'Pallet Town Mart'],
    ['celadon', 'Celadon City Department Store'],
  ] as const)('names %s %s', (locationId, expected) => {
    expect(storeName(locationById(locationId))).toBe(expected)
  })
})

describe('storeItems', () => {
  it('lists a mart in ladder order', () => {
    expect(storeItems(locationById('viridian')).map((item) => item.id)).toEqual([
      'potion',
      'antidote',
      'pokeBall',
      'paralyzeHeal',
    ])
  })
})

describe('storeFloors', () => {
  it('is undefined for a single-floor mart', () => {
    expect(storeFloors(locationById('pewter'))).toBeUndefined()
  })

  it('groups the Department Store by floor', () => {
    const floors = storeFloors(locationById('celadon')) ?? []

    expect(floors.map((floor) => [floor.name, floor.items.length])).toEqual([
      ["2F · Trainer's Market", 19],
      ['4F · Wise Man Gifts', 4],
      ['5F · Drugstore', 13],
      ['Roof · Vending Machines', 3],
    ])
  })

  it('shows every Department Store item exactly once', () => {
    const celadon = locationById('celadon')
    const shown = (storeFloors(celadon) ?? []).flatMap((floor) =>
      floor.items.map((item) => item.id),
    )

    expect([...shown].sort()).toEqual([...celadon.stock].sort())
    expect(new Set(shown).size).toBe(shown.length)
  })
})

describe('openStock', () => {
  it('sells everything at a location without floors', () => {
    expect(openStock(locationById('lavender'), 1)).toEqual(locationById('lavender').stock)
  })

  it('sells only the open floors at the Department Store', () => {
    const [secondFloor, fourthFloor] = locationById('celadon').floors ?? []

    expect(openStock(locationById('celadon'), 2)).toEqual([
      ...secondFloor.stock,
      ...fourthFloor.stock,
    ])
  })
})

describe('shortFloorName', () => {
  it.each([
    ["2F · Trainer's Market", '2F'],
    ['Roof · Vending Machines', 'Roof'],
  ])('shortens %s to %s', (name, expected) => {
    expect(shortFloorName({ name, stock: [] })).toBe(expected)
  })
})

describe('nextFloor', () => {
  it('is nothing before Celadon opens', () => {
    expect(nextFloor(6, 1)).toBeUndefined()
  })

  it.each([
    [1, '4F · Wise Man Gifts', 1e9],
    [2, '5F · Drugstore', 2e9],
    [3, 'Roof · Vending Machines', 3e9],
  ])('after %i floors is %s for %d', (floorsOpen, name, openCost) => {
    expect(nextFloor(7, floorsOpen)).toMatchObject({ name, openCost })
  })

  it('is nothing once the roof is open', () => {
    expect(nextFloor(7, 4)).toBeUndefined()
  })
})

describe('nextLocation', () => {
  it('is Viridian from Pallet', () => {
    expect(nextLocation(1)?.id).toBe('viridian')
  })

  it.each([
    [2, 'pewter'],
    [3, 'cerulean'],
    [4, 'vermilion'],
    [5, 'lavender'],
    [6, 'celadon'],
  ])('with %i locations open is %s', (martsOwned, expected) => {
    expect(nextLocation(martsOwned)?.id).toBe(expected)
  })

  it('stops at the last playable location', () => {
    expect(nextLocation(PLAYABLE_LOCATIONS)).toBeUndefined()
  })
})

describe('newStock', () => {
  it.each([
    ['pallet', ['potion']],
    ['viridian', ['antidote', 'pokeBall', 'paralyzeHeal']],
    ['pewter', ['awakening', 'burnHeal', 'repel', 'escapeRope']],
    ['cerulean', ['superPotion']],
    ['vermilion', ['iceHeal']],
    ['lavender', ['superRepel', 'greatBall']],
    ['cinnabar', []],
  ] as const)('%s introduces %j', (locationId, expected) => {
    expect(newStock(locationById(locationId))).toEqual(expected)
  })
})

describe('shortLocationName', () => {
  it.each([
    ['pallet', 'Pallet'],
    ['viridian', 'Viridian'],
    ['cinnabar', 'Cinnabar'],
    ['indigoPlateau', 'Indigo Plateau'],
  ] as const)('shortens %s to %s', (locationId, expected) => {
    expect(shortLocationName(locationById(locationId))).toBe(expected)
  })
})
