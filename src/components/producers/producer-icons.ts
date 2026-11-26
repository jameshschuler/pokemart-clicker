import {
  BikeIcon,
  CupSodaIcon,
  FactoryIcon,
  FlaskConicalIcon,
  HandIcon,
  type LucideIcon,
  ShipIcon,
  TruckIcon,
  UserRoundIcon,
} from 'lucide-react'
import type { ProducerId } from '@/game/producers'

/** Placeholder art until each producer gets its own. */
export const PRODUCER_ICONS: Record<ProducerId, LucideIcon> = {
  helpingHand: HandIcon,
  deliveryBike: BikeIcon,
  vendingMachine: CupSodaIcon,
  employee: UserRoundIcon,
  deliveryTruck: TruckIcon,
  medicineLab: FlaskConicalIcon,
  trader: ShipIcon,
  factory: FactoryIcon,
}
