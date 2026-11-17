import { describe, expect, it } from 'vitest'
import { LOCATIONS, locationById, PLAYABLE_LOCATIONS } from './locations'
import { availableRegisterUpgrades, nextLockedRegisterUpgrade, REGISTER_UPGRADES } from './upgrades'

describe('register upgrades', () => {
  it('costs more each step', () => {
    for (let index = 1; index < REGISTER_UPGRADES.length; index++) {
      expect(REGISTER_UPGRADES[index].cost).toBeGreaterThan(REGISTER_UPGRADES[index - 1].cost)
    }
  })

  it('lists upgrades in route order', () => {
    const routeIndex = (upgradeIndex: number) =>
      LOCATIONS.indexOf(locationById(REGISTER_UPGRADES[upgradeIndex].location))

    for (let index = 1; index < REGISTER_UPGRADES.length; index++) {
      expect(routeIndex(index)).toBeGreaterThanOrEqual(routeIndex(index - 1))
    }
  })

  it('unlocks at least one upgrade in every location', () => {
    const locations = new Set(REGISTER_UPGRADES.map((upgrade) => upgrade.location))

    for (const location of LOCATIONS) {
      expect(locations).toContain(location.id)
    }
  })
})

describe('availableRegisterUpgrades', () => {
  const ids = (owned: Parameters<typeof availableRegisterUpgrades>[0], martsOwned: number) =>
    availableRegisterUpgrades(owned, martsOwned).map((upgrade) => upgrade.id)

  it.each([
    [[], 1, ['secondTill']],
    [[], 2, ['secondTill', 'meowthCoinCounter', 'machopBagger']],
    [['meowthCoinCounter'], 2, ['secondTill', 'machopBagger']],
    [['secondTill'], 1, []],
  ] as const)('with %j owned and %i locations offers %j', (owned, martsOwned, expected) => {
    expect(ids([...owned], martsOwned)).toEqual(expected)
  })
})

describe('nextLockedRegisterUpgrade', () => {
  it.each([
    [1, 'meowthCoinCounter'],
    [PLAYABLE_LOCATIONS, undefined],
  ] as const)('with %i locations open is %s', (martsOwned, expected) => {
    expect(nextLockedRegisterUpgrade(martsOwned)?.id).toBe(expected)
  })
})
