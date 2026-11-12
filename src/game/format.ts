const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']

// Absorbs float error so 1.15 × 100 truncates to 115, not 114.
const TRUNCATE_EPSILON = 1e-9

/**
 * Whole-number money: 999 → "999", 12_345 → "12,345", 1_234_567 → "1.23M". Truncates rather than
 * rounds, so 999_999_999 reads "999M", never "1000M".
 */
export function formatMoney(value: number): string {
  const whole = Math.floor(value)
  if (whole < 1_000_000) {
    return whole.toLocaleString('en-US')
  }

  const tier = Math.min(Math.floor(Math.log10(whole) / 3), SUFFIXES.length - 1)
  const scaled = whole / 1000 ** tier
  const decimals = scaled < 10 ? 2 : scaled < 100 ? 1 : 0
  const factor = 10 ** decimals
  const truncated = Math.floor(scaled * factor + TRUNCATE_EPSILON) / factor

  return `${truncated.toFixed(decimals)}${SUFFIXES[tier]}`
}

/** Play time: 45 → "45s", 754 → "12m 34s", 7_380 → "2h 3m". */
export function formatDuration(seconds: number): string {
  const whole = Math.floor(seconds)
  const hours = Math.floor(whole / 3600)
  const minutes = Math.floor((whole % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  if (minutes > 0) {
    return `${minutes}m ${whole % 60}s`
  }

  return `${whole}s`
}

/** Multiplier fractions as whole percents: 0.15 → "15%". */
export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`
}

/** Rates keep one decimal while small: 0.1 → "0.1", 34.25 → "34.3", 1_500 → "1,500". */
export function formatRate(value: number): string {
  if (value < 100) {
    return (Math.round(value * 10) / 10).toLocaleString('en-US')
  }

  return formatMoney(value)
}
