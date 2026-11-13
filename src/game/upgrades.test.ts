import { describe, expect, it } from 'vitest'
import { nextRegisterUpgrade, REGISTER_UPGRADES, upgradeLabel } from './upgrades'

describe('register upgrades', () => {
  it('costs more each step', () => {
    for (let index = 1; index < REGISTER_UPGRADES.length; index++) {
      expect(REGISTER_UPGRADES[index].cost).toBeGreaterThan(REGISTER_UPGRADES[index - 1].cost)
    }
  })

  it.each([
    ['secondTill', 'Register upgrade 1'],
    ['selfCheckout', 'Register upgrade 17'],
  ] as const)('labels %s as %s', (upgradeId, expected) => {
    expect(upgradeLabel(upgradeId)).toBe(expected)
  })
})

describe('nextRegisterUpgrade', () => {
  it.each([
    [[], 'secondTill'],
    [['secondTill'], 'meowthCoinCounter'],
    [['meowthCoinCounter'], 'secondTill'],
  ] as const)('after %j offers %s', (owned, expected) => {
    expect(nextRegisterUpgrade([...owned])?.id).toBe(expected)
  })

  it('offers nothing once every upgrade is owned', () => {
    expect(nextRegisterUpgrade(REGISTER_UPGRADES.map((upgrade) => upgrade.id))).toBeUndefined()
  })
})
