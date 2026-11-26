import { isLocationOpen, type LocationId } from './locations'

export type ProducerId =
  | 'helpingHand'
  | 'deliveryBike'
  | 'vendingMachine'
  | 'employee'
  | 'deliveryTruck'
  | 'medicineLab'
  | 'trader'
  | 'factory'

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
    id: 'helpingHand',
    name: 'Helping Hand',
    plural: 'Helping Hands',
    description: 'Rings up a sale at the register every 10 seconds, so you don’t have to.',
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
    id: 'employee',
    name: 'Employee',
    plural: 'Employees',
    description:
      'Stocks shelves, rings up sales and keeps trainers heading for Viridian Forest supplied.',
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
  {
    id: 'medicineLab',
    name: 'Medicine Lab',
    plural: 'Medicine Labs',
    description: 'Brews Potions, Antidotes and every Heal with fresh water from Cerulean.',
    location: 'cerulean',
    baseCost: 1_400_000,
    salesPerSecond: 1_400,
  },
  {
    id: 'trader',
    name: 'Trader',
    plural: 'Traders',
    description: 'Ships stock in and out of Vermilion Harbor, trading with ports overseas.',
    location: 'vermilion',
    baseCost: 20_000_000,
    salesPerSecond: 7_800,
  },
  {
    id: 'factory',
    name: 'Factory',
    plural: 'Factories',
    description:
      'Turns out Poké Balls, Repels and Escape Ropes on Route 8, just outside Lavender Town.',
    location: 'lavender',
    baseCost: 330_000_000,
    salesPerSecond: 44_000,
  },
]

export function nextLockedProducer(martsOwned: number): Producer | undefined {
  return PRODUCERS.find((producer) => !isLocationOpen(producer.location, martsOwned))
}
