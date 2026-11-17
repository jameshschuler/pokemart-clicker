import { isLocationOpen, type LocationId, PLAYABLE_LOCATIONS } from './locations'

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

export interface RegisterUpgrade {
  id: RegisterUpgradeId
  name: string
  description: string
  /** The location whose opening puts it on offer. */
  location: LocationId
  cost: number
}

export const REGISTER_UPGRADES: RegisterUpgrade[] = [
  {
    id: 'secondTill',
    name: 'Second Till',
    description: 'Two cash drawers, half the waiting.',
    location: 'pallet',
    cost: 250,
  },
  {
    id: 'meowthCoinCounter',
    name: 'Meowth Coin Counter',
    description: 'Meowth counts the change. Pay Day comes naturally.',
    location: 'viridian',
    cost: 1_000,
  },
  {
    id: 'machopBagger',
    name: 'Machop Bagger',
    description: 'A Machop bags every order while you ring it up.',
    location: 'viridian',
    cost: 3_000,
  },
  {
    id: 'electricTill',
    name: 'Electric Till',
    description: 'Retires the hand-crank register. A Pikachu keeps it charged.',
    location: 'pewter',
    cost: 6_000,
  },
  {
    id: 'receiptPrinter',
    name: 'Receipt Printer',
    description: 'Prints a receipt in a second. No more handwritten tickets.',
    location: 'pewter',
    cost: 12_000,
  },
  {
    id: 'barcodeScanner',
    name: 'Barcode Scanner',
    description: 'No more typing in prices by hand.',
    location: 'cerulean',
    cost: 30_000,
  },
  {
    id: 'creditCardMachine',
    name: 'Credit Card Machine',
    description: 'Takes cards, not just cash. Sailors off the S.S. Anne never carry cash.',
    location: 'vermilion',
    cost: 150_000,
  },
  {
    id: 'expressLane',
    name: 'Express Lane',
    description: 'Ten items or fewer. Trainers in a hurry love it.',
    location: 'lavender',
    cost: 250_000,
  },
  {
    id: 'loyaltyStamps',
    name: 'Loyalty Stamps',
    description: 'Every sale at the register earns a stamp, and regulars spend more.',
    location: 'lavender',
    cost: 400_000,
  },
  {
    id: 'conveyorBelt',
    name: 'Conveyor Belt',
    description: 'Items roll up to the till on their own.',
    location: 'celadon',
    cost: 1.2e6,
  },
  {
    id: 'departmentCounter',
    name: 'Department Store Counter',
    description: 'A long counter with four tills, straight out of Celadon.',
    location: 'celadon',
    cost: 2e6,
  },
  {
    id: 'chanseyCashier',
    name: 'Chansey Cashier',
    description: 'Chansey opens a second register. Nobody leaves without a smile.',
    location: 'fuchsia',
    cost: 8e6,
  },
  {
    id: 'silphCardReader',
    name: 'Silph Card Reader',
    description: 'Tap to pay. Silph Co. tech, mostly legal.',
    location: 'saffron',
    cost: 15e6,
  },
  {
    id: 'alakazamPriceCheck',
    name: 'Alakazam Price Check',
    description: 'Knows every price by heart. Price checks take no time at all.',
    location: 'saffron',
    cost: 20e6,
  },
  {
    id: 'machampBagger',
    name: 'Machamp Bagger',
    description: 'Machop evolved. Four arms, four bags at once.',
    location: 'saffron',
    cost: 30e6,
  },
  {
    id: 'porygonTablet',
    name: 'Porygon Tablet',
    description: 'The register is a tablet now. Porygon runs the software.',
    location: 'cinnabar',
    cost: 45e6,
  },
  {
    id: 'selfCheckout',
    name: 'Self Checkout',
    description: 'Trainers ring themselves up. Nobody steals a Potion. Probably.',
    location: 'indigoPlateau',
    cost: 100e6,
  },
]

/** Upgrades whose location is open, owned or not, in cost order. */
export function unlockedRegisterUpgrades(martsOwned: number): RegisterUpgrade[] {
  return REGISTER_UPGRADES.filter((upgrade) => isLocationOpen(upgrade.location, martsOwned))
}

/** Upgrades on offer: every one from an open location not owned yet, cheapest first. */
export function availableRegisterUpgrades(
  owned: RegisterUpgradeId[],
  martsOwned: number,
): RegisterUpgrade[] {
  const ownedIds = new Set(owned)

  return unlockedRegisterUpgrades(martsOwned).filter((upgrade) => !ownedIds.has(upgrade.id))
}

/** The next upgrade waiting on a location that can open in this build, for a "More open with …" hint. */
export function nextLockedRegisterUpgrade(martsOwned: number): RegisterUpgrade | undefined {
  return REGISTER_UPGRADES.find(
    (upgrade) =>
      !isLocationOpen(upgrade.location, martsOwned) &&
      isLocationOpen(upgrade.location, PLAYABLE_LOCATIONS),
  )
}
