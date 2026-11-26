import { describe, expect, it } from 'vitest'
import { PLAYABLE_LOCATIONS } from './locations'
import { nextLockedProducer } from './producers'

describe('nextLockedProducer', () => {
  it.each([
    [1, 'employee'],
    [2, 'deliveryTruck'],
    [5, 'factory'],
  ])('with %i locations open is %s', (martsOwned, expected) => {
    expect(nextLockedProducer(martsOwned)?.id).toBe(expected)
  })

  it('is nothing once every producer is unlocked', () => {
    expect(nextLockedProducer(PLAYABLE_LOCATIONS)).toBeUndefined()
  })
})
