import {
  BikeIcon,
  CupSodaIcon,
  DiscIcon,
  FactoryIcon,
  FlaskConicalIcon,
  HandIcon,
  type LucideIcon,
  ShipIcon,
  TruckIcon,
  UserRoundIcon,
} from 'lucide-react'
import type { ProducerId } from '@/game/producers'

interface ProducerArt {
  icon: LucideIcon
  /** Icon tile colors, shown while the next one is affordable. */
  tint: string
}

/** Placeholder art until each producer gets its own. */
export const PRODUCER_ART: Record<ProducerId, ProducerArt> = {
  helpingHand: {
    icon: HandIcon,
    tint: 'border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
  },
  deliveryBike: {
    icon: BikeIcon,
    tint: 'border-sky-300 bg-sky-50 text-sky-600 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-400',
  },
  vendingMachine: {
    icon: CupSodaIcon,
    tint: 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400',
  },
  employee: {
    icon: UserRoundIcon,
    tint: 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400',
  },
  deliveryTruck: {
    icon: TruckIcon,
    tint: 'border-orange-300 bg-orange-50 text-orange-600 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-400',
  },
  medicineLab: {
    icon: FlaskConicalIcon,
    tint: 'border-violet-300 bg-violet-50 text-violet-600 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-400',
  },
  trader: {
    icon: ShipIcon,
    tint: 'border-cyan-300 bg-cyan-50 text-cyan-600 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-400',
  },
  factory: {
    icon: FactoryIcon,
    tint: 'border-stone-400 bg-stone-100 text-stone-700 dark:border-stone-600 dark:bg-stone-800/60 dark:text-stone-300',
  },
  tmWorkshop: {
    icon: DiscIcon,
    tint: 'border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400',
  },
}
