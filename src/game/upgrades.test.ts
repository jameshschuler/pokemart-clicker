import { describe, expect, it } from 'vitest'
import { TOWNS } from './towns'
import { REGISTER_UPGRADES } from './upgrades'

describe('register upgrades', () => {
  it('unlocks at least one upgrade in every town', () => {
    const towns = new Set(REGISTER_UPGRADES.map((upgrade) => upgrade.town))

    for (const town of TOWNS) {
      expect(towns).toContain(town.id)
    }
  })

  it('costs more the further along the route', () => {
    for (let index = 1; index < REGISTER_UPGRADES.length; index++) {
      expect(REGISTER_UPGRADES[index].cost).toBeGreaterThan(REGISTER_UPGRADES[index - 1].cost)
    }
  })
})
