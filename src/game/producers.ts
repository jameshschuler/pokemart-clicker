import type { TownId } from './towns'

export type ProducerId = 'flyer' | 'deliveryBike' | 'vendingMachine' | 'stockClerk'

export interface Producer {
  id: ProducerId
  name: string
  plural: string
  description: string
  /** The town whose opening makes it available. */
  town: TownId
  baseCost: number
  /** Sales a second, each worth the sale value. */
  salesPerSecond: number
}

export const PRODUCERS: Producer[] = [
  {
    id: 'flyer',
    name: 'Flyer',
    plural: 'Flyers',
    description: 'Pinned up around Pallet Town. Brings in a walk-in every 10 seconds.',
    town: 'pallet',
    baseCost: 15,
    salesPerSecond: 0.1,
  },
  {
    id: 'deliveryBike',
    name: 'Delivery Bike',
    plural: 'Delivery Bikes',
    description: 'Rides orders out to trainers on Route 1.',
    town: 'pallet',
    baseCost: 100,
    salesPerSecond: 1,
  },
  {
    id: 'vendingMachine',
    name: 'Vending Machine',
    plural: 'Vending Machines',
    description: 'Sells outside the door, day and night.',
    town: 'pallet',
    baseCost: 1_100,
    salesPerSecond: 8,
  },
  {
    id: 'stockClerk',
    name: 'Stock Clerk',
    plural: 'Stock Clerks',
    description:
      'Keeps the shelves full so trainers heading for Viridian Forest never find them empty.',
    town: 'viridian',
    baseCost: 12_000,
    salesPerSecond: 47,
  },
]
