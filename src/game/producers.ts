import type { LocationId } from './locations'

export type ProducerId =
  'flyer' | 'deliveryBike' | 'vendingMachine' | 'stockClerk' | 'deliveryTruck'

export interface Producer {
  id: ProducerId
  name: string
  plural: string
  description: string
  /** The location whose opening makes it available. */
  location: LocationId
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
    location: 'pallet',
    baseCost: 15,
    salesPerSecond: 0.1,
  },
  {
    id: 'deliveryBike',
    name: 'Delivery Bike',
    plural: 'Delivery Bikes',
    description: 'Rides orders out to trainers on Route 1.',
    location: 'pallet',
    baseCost: 100,
    salesPerSecond: 1,
  },
  {
    id: 'vendingMachine',
    name: 'Vending Machine',
    plural: 'Vending Machines',
    description: 'Sells outside the door, day and night.',
    location: 'pallet',
    baseCost: 1_100,
    salesPerSecond: 8,
  },
  {
    id: 'stockClerk',
    name: 'Stock Clerk',
    plural: 'Stock Clerks',
    description:
      'Keeps the shelves full so trainers heading for Viridian Forest never find them empty.',
    location: 'viridian',
    baseCost: 12_000,
    salesPerSecond: 47,
  },
  {
    id: 'deliveryTruck',
    name: 'Delivery Truck',
    plural: 'Delivery Trucks',
    description: 'Hauls crates up the road to Pewter and back down with orders for Mt. Moon.',
    location: 'pewter',
    baseCost: 130_000,
    salesPerSecond: 260,
  },
]
