import type { MetricStatus, StateRiskLevel } from '../types/metrics'

export const metricStatusStyles: Record<
  MetricStatus,
  { bg: string; text: string; border: string; accent: string }
> = {
  positive: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-100',
    accent: 'text-emerald-500',
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-100',
    accent: 'text-amber-500',
  },
  negative: {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-100',
    accent: 'text-rose-500',
  },
}

export const riskColors: Record<StateRiskLevel, string> = {
  Low: '#22c55e',
  Moderate: '#f59e0b',
  High: '#ef4444',
}

export const growthLegend = [
  { min: Number.NEGATIVE_INFINITY, max: 0, label: '< 0%', color: '#e2e8f0' },
  { min: 0, max: 0.02, label: '0 - 2%', color: '#cbd5ff' },
  { min: 0.02, max: 0.04, label: '2 - 4%', color: '#93c5fd' },
  { min: 0.04, max: 0.06, label: '4 - 6%', color: '#4f86f7' },
  { min: 0.06, max: Number.POSITIVE_INFINITY, label: '6%+', color: '#1e52c0' },
]

export const getGrowthColor = (growth: number) => {
  const band = growthLegend.find(({ min, max }) => growth >= min && growth < max)
  return band?.color ?? '#e2e8f0'
}
