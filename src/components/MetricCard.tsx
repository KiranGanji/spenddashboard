import { clsx } from 'clsx'
import { NationalKpi } from '../types/metrics'
import { formatDelta, formatMetricValue } from '../utils/formatters'
import { metricStatusStyles } from '../utils/colors'

type MetricCardProps = {
  metric: NationalKpi
  baselineLabel: string
}

const ArrowIcon = ({ direction }: { direction: 'up' | 'down' }) => (
  <svg
    className={clsx('h-4 w-4', direction === 'up' ? 'rotate-0' : 'rotate-180')}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden
  >
    <path d="M10 4.167 4.167 10H8.75v5.833h2.5V10h4.583z" />
  </svg>
)

export const MetricCard = ({ metric, baselineLabel }: MetricCardProps) => {
  const tone = metricStatusStyles[metric.status]
  const formattedValue = formatMetricValue(metric.value, metric.unit)
  const deltaLabel = `${formatDelta(metric.delta, 'percent')} vs ${baselineLabel}`

  return (
    <div
      className={clsx(
        'glass-panel relative flex h-full min-h-[150px] flex-col rounded-2xl border p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg md:min-h-[160px] lg:min-h-[170px]',
        tone.border,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="min-h-[48px] text-sm font-medium leading-snug text-slate-500 md:min-h-[52px]">
            {metric.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{formattedValue}</p>
        </div>
        <div
          className={clsx(
            'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
            tone.bg,
            tone.text,
            tone.border,
            'border',
          )}
        >
          <ArrowIcon direction={metric.delta.direction} />
          <span>{formatDelta(metric.delta, 'percent')}</span>
        </div>
      </div>
      <p className="mt-auto pt-3 text-xs text-slate-500">{deltaLabel}</p>
    </div>
  )
}
