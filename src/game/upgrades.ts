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

export type RegisterEffect = { kind: 'double' } | { kind: 'incomeShare'; share: number }

export interface RegisterUpgrade {
  id: RegisterUpgradeId
  cost: number
  effect: RegisterEffect
}

const DOUBLE: RegisterEffect = { kind: 'double' }
const INCOME_SHARE: RegisterEffect = { kind: 'incomeShare', share: 0.01 }

export const REGISTER_UPGRADES: RegisterUpgrade[] = [
  {
    id: 'secondTill',
    cost: 100,
    effect: DOUBLE,
  },
  {
    id: 'meowthCoinCounter',
    cost: 400,
    effect: DOUBLE,
  },
  {
    id: 'machopBagger',
    cost: 1_000,
    effect: DOUBLE,
  },
  {
    id: 'electricTill',
    cost: 6_000,
    effect: DOUBLE,
  },
  {
    id: 'receiptPrinter',
    cost: 12_000,
    effect: INCOME_SHARE,
  },
  {
    id: 'barcodeScanner',
    cost: 30_000,
    effect: INCOME_SHARE,
  },
  {
    id: 'creditCardMachine',
    cost: 150_000,
    effect: INCOME_SHARE,
  },
  {
    id: 'expressLane',
    cost: 250_000,
    effect: INCOME_SHARE,
  },
  {
    id: 'loyaltyStamps',
    cost: 400_000,
    effect: INCOME_SHARE,
  },
  {
    id: 'conveyorBelt',
    cost: 1.2e6,
    effect: INCOME_SHARE,
  },
  {
    id: 'departmentCounter',
    cost: 2e6,
    effect: INCOME_SHARE,
  },
  {
    id: 'chanseyCashier',
    cost: 8e6,
    effect: INCOME_SHARE,
  },
  {
    id: 'silphCardReader',
    cost: 15e6,
    effect: INCOME_SHARE,
  },
  {
    id: 'alakazamPriceCheck',
    cost: 20e6,
    effect: INCOME_SHARE,
  },
  {
    id: 'machampBagger',
    cost: 30e6,
    effect: INCOME_SHARE,
  },
  {
    id: 'porygonTablet',
    cost: 45e6,
    effect: INCOME_SHARE,
  },
  {
    id: 'selfCheckout',
    cost: 100e6,
    effect: INCOME_SHARE,
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

export function describeEffect(effect: RegisterEffect): string {
  return effect.kind === 'double'
    ? '×2 per click'
    : `+${formatPercent(effect.share)} of income per click`
}
