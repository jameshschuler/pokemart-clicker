export type ProducerId = 'flyer'

export interface Producer {
  id: ProducerId
  name: string
  description: string
  baseCost: number
  /** Sales a second, each worth the sale value. */
  salesPerSecond: number
}

export const PRODUCERS: Producer[] = [
  {
    id: 'flyer',
    name: 'Flyer',
    description: 'Pinned up around Pallet Town. Brings in a walk-in every 10 seconds.',
    baseCost: 15,
    salesPerSecond: 0.1,
  },
]
