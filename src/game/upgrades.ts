import { formatPercent } from './format'

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
  cost: number
  /** Share of income per second each click adds. */
  incomeShare: number
}

/** Early upgrades give more, since early income is small. */
const EARLY_SHARE = 0.02
const LATE_SHARE = 0.01

export const REGISTER_UPGRADES: RegisterUpgrade[] = [
  {
    id: 'secondTill',
    cost: 100,
    incomeShare: EARLY_SHARE,
  },
  {
    id: 'meowthCoinCounter',
    cost: 400,
    incomeShare: EARLY_SHARE,
  },
  {
    id: 'machopBagger',
    cost: 1_000,
    incomeShare: EARLY_SHARE,
  },
  {
    id: 'electricTill',
    cost: 6_000,
    incomeShare: EARLY_SHARE,
  },
  {
    id: 'receiptPrinter',
    cost: 12_000,
    incomeShare: LATE_SHARE,
  },
  {
    id: 'barcodeScanner',
    cost: 30_000,
    incomeShare: LATE_SHARE,
  },
  {
    id: 'creditCardMachine',
    cost: 150_000,
    incomeShare: LATE_SHARE,
  },
  {
    id: 'expressLane',
    cost: 250_000,
    incomeShare: LATE_SHARE,
  },
  {
    id: 'loyaltyStamps',
    cost: 400_000,
    incomeShare: LATE_SHARE,
  },
  {
    id: 'conveyorBelt',
    cost: 1.2e6,
    incomeShare: LATE_SHARE,
  },
  {
    id: 'departmentCounter',
    cost: 2e6,
    incomeShare: LATE_SHARE,
  },
  {
    id: 'chanseyCashier',
    cost: 8e6,
    incomeShare: LATE_SHARE,
  },
  {
    id: 'silphCardReader',
    cost: 15e6,
    incomeShare: LATE_SHARE,
  },
  {
    id: 'alakazamPriceCheck',
    cost: 20e6,
    incomeShare: LATE_SHARE,
  },
  {
    id: 'machampBagger',
    cost: 30e6,
    incomeShare: LATE_SHARE,
  },
  {
    id: 'porygonTablet',
    cost: 45e6,
    incomeShare: LATE_SHARE,
  },
  {
    id: 'selfCheckout',
    cost: 100e6,
    incomeShare: LATE_SHARE,
  },
]

const UPGRADE_NUMBER = new Map(REGISTER_UPGRADES.map((upgrade, index) => [upgrade.id, index]))

/** The one register upgrade on offer: the first not yet owned. Placeholder until step 3. */
export function nextRegisterUpgrade(owned: RegisterUpgradeId[]): RegisterUpgrade | undefined {
  const ownedIds = new Set(owned)

  return REGISTER_UPGRADES.find((upgrade) => !ownedIds.has(upgrade.id))
}

/** Placeholder label until register upgrades are redesigned: "Register upgrade 3". */
export function upgradeLabel(upgradeId: RegisterUpgradeId): string {
  return `Register upgrade ${(UPGRADE_NUMBER.get(upgradeId) ?? 0) + 1}`
}

export function describeEffect(upgrade: RegisterUpgrade): string {
  return `+${formatPercent(upgrade.incomeShare)} of income per click`
}
