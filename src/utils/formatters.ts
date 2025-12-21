import { DetailMetricUnit, MetricDelta, MetricUnit } from '../types/metrics'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const currencyCompactFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 1,
  notation: 'compact',
})

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

export const formatPercent = (value: number, digits = 1) =>
  `${(value * 100).toFixed(digits)}%`

export const formatMetricValue = (
  value: number,
  unit: MetricUnit | DetailMetricUnit,
  { compactCurrency = true }: { compactCurrency?: boolean } = {},
) => {
  switch (unit) {
    case 'currency':
      return compactCurrency
        ? currencyCompactFormatter.format(value)
        : currencyFormatter.format(value)
    case 'ratio':
      return formatPercent(value, 1)
    case 'percent':
      return formatPercent(value, 1)
    case 'per1k':
      return `${numberFormatter.format(value)} /1K`
    case 'days':
      return `${numberFormatter.format(value)} days`
    case 'members':
      return numberFormatter.format(value)
    default:
      return numberFormatter.format(value)
  }
}

export const formatDelta = (delta: MetricDelta, unit: MetricUnit | 'percent') => {
  const prefix = delta.direction === 'up' ? '+' : ''
  if (unit === 'currency') {
    return `${prefix}${currencyFormatter.format(delta.value)}`
  }
  return `${prefix}${formatPercent(delta.value, 1)}`
}
