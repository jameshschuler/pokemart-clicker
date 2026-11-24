import {
  BikeIcon,
  CupSodaIcon,
  type LucideIcon,
  NewspaperIcon,
  PackageOpenIcon,
  ScanBarcodeIcon,
  TruckIcon,
} from 'lucide-react'
import type { ProducerId } from '@/game/producers'

/** Placeholder art until each producer gets its own. */
export const PRODUCER_ICONS: Record<ProducerId, LucideIcon> = {
  flyer: NewspaperIcon,
  deliveryBike: BikeIcon,
  vendingMachine: CupSodaIcon,
  stockClerk: PackageOpenIcon,
  deliveryTruck: TruckIcon,
  cashier: ScanBarcodeIcon,
}
