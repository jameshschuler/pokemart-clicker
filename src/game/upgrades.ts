import { formatPercent } from './format'
import type { TownId } from './towns'

export type RegisterUpgradeId =
  | 'secondTill'
  | 'meowthCoinCounter'
  | 'machopBagger'
  | 'electricTill'
  | 'receiptPrinter'
  | 'barcodeScanner'
  | 'creditCardMachine'
  | 'expressLane'
  | 'loyaltyStamps'
  | 'conveyorBelt'
  | 'departmentCounter'
  | 'chanseyCashier'
  | 'silphCardReader'
  | 'alakazamPriceCheck'
  | 'machampBagger'
  | 'porygonTablet'
  | 'selfCheckout'

export type RegisterEffect = { kind: 'double' } | { kind: 'salesShare'; share: number }

export interface RegisterUpgrade {
  id: RegisterUpgradeId
  name: string
  description: string
  town: TownId
  cost: number
  effect: RegisterEffect
}

const DOUBLE: RegisterEffect = { kind: 'double' }
const SALES_SHARE: RegisterEffect = { kind: 'salesShare', share: 0.01 }

export const REGISTER_UPGRADES: RegisterUpgrade[] = [
  {
    id: 'secondTill',
    name: 'Second Till',
    description: 'Two cash drawers, half the waiting.',
    town: 'pallet',
    cost: 100,
    effect: DOUBLE,
  },
  {
    id: 'meowthCoinCounter',
    name: 'Meowth Coin Counter',
    description: 'Meowth counts the change. Pay Day comes naturally.',
    town: 'viridian',
    cost: 400,
    effect: DOUBLE,
  },
  {
    id: 'machopBagger',
    name: 'Machop Bagger',
    description: 'A Machop bags every order while you ring it up.',
    town: 'viridian',
    cost: 1_000,
    effect: DOUBLE,
  },
  {
    id: 'electricTill',
    name: 'Electric Till',
    description: 'Retires the hand-crank register. A Pikachu keeps it charged.',
    town: 'pewter',
    cost: 6_000,
    effect: DOUBLE,
  },
  {
    id: 'receiptPrinter',
    name: 'Receipt Printer',
    description: 'Prints a receipt in a second. No more handwritten tickets.',
    town: 'pewter',
    cost: 12_000,
    effect: SALES_SHARE,
  },
  {
    id: 'barcodeScanner',
    name: 'Barcode Scanner',
    description: 'No more typing in prices by hand.',
    town: 'cerulean',
    cost: 30_000,
    effect: SALES_SHARE,
  },
  {
    id: 'creditCardMachine',
    name: 'Credit Card Machine',
    description: 'Takes cards, not just cash. Sailors off the S.S. Anne never carry cash.',
    town: 'vermilion',
    cost: 150_000,
    effect: SALES_SHARE,
  },
  {
    id: 'expressLane',
    name: 'Express Lane',
    description: 'Ten items or fewer. Trainers in a hurry love it.',
    town: 'lavender',
    cost: 250_000,
    effect: SALES_SHARE,
  },
  {
    id: 'loyaltyStamps',
    name: 'Loyalty Stamps',
    description: 'Every sale at the register earns a stamp, and regulars spend more.',
    town: 'lavender',
    cost: 400_000,
    effect: SALES_SHARE,
  },
  {
    id: 'conveyorBelt',
    name: 'Conveyor Belt',
    description: 'Items roll up to the till on their own.',
    town: 'celadon',
    cost: 1.2e6,
    effect: SALES_SHARE,
  },
  {
    id: 'departmentCounter',
    name: 'Department Store Counter',
    description: 'A long counter with four tills, straight out of Celadon.',
    town: 'celadon',
    cost: 2e6,
    effect: SALES_SHARE,
  },
  {
    id: 'chanseyCashier',
    name: 'Chansey Cashier',
    description: 'Chansey opens a second register. Nobody leaves without a smile.',
    town: 'fuchsia',
    cost: 8e6,
    effect: SALES_SHARE,
  },
  {
    id: 'silphCardReader',
    name: 'Silph Card Reader',
    description: 'Tap to pay. Silph Co. tech, mostly legal.',
    town: 'saffron',
    cost: 15e6,
    effect: SALES_SHARE,
  },
  {
    id: 'alakazamPriceCheck',
    name: 'Alakazam Price Check',
    description: 'Knows every price by heart. Price checks take no time at all.',
    town: 'saffron',
    cost: 20e6,
    effect: SALES_SHARE,
  },
  {
    id: 'machampBagger',
    name: 'Machamp Bagger',
    description: 'Machop evolved. Four arms, four bags at once.',
    town: 'saffron',
    cost: 30e6,
    effect: SALES_SHARE,
  },
  {
    id: 'porygonTablet',
    name: 'Porygon Tablet',
    description: 'The register is a tablet now. Porygon runs the software.',
    town: 'cinnabar',
    cost: 45e6,
    effect: SALES_SHARE,
  },
  {
    id: 'selfCheckout',
    name: 'Self Checkout',
    description: 'Trainers ring themselves up. Nobody steals a Potion. Probably.',
    town: 'indigoPlateau',
    cost: 100e6,
    effect: SALES_SHARE,
  },
]

export function describeEffect(effect: RegisterEffect): string {
  return effect.kind === 'double'
    ? '×2 per click'
    : `+${formatPercent(effect.share)} of chain ₽/s per click`
}
