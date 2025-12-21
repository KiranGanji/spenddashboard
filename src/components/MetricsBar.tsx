import { useNationalMetrics } from '../hooks/useNationalMetrics'
import { MetricCard } from './MetricCard'

type MetricsBarProps = {
  onPrimaryKpiClick?: () => void
}

export const MetricsBar = ({ onPrimaryKpiClick }: MetricsBarProps) => {
  const { meta, kpis } = useNationalMetrics()

  return (
    <section className="-mx-6 mb-6 bg-gradient-to-b from-white/95 via-white/95 to-white/70 px-6 pb-4 pt-4">
      <div className="flex flex-col gap-1 pb-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ocean-600">
            Medical Spend Outlook
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            Executive KPIs — {meta.reportingPeriod}
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Baseline: {meta.baselineLabel} • Data source: Forecast Model
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {kpis.map((kpi, index) => (
          <MetricCard
            key={kpi.id}
            metric={kpi}
            baselineLabel={meta.baselineLabel}
            onClick={index === 0 ? onPrimaryKpiClick : undefined}
          />
        ))}
      </div>
    </section>
  )
}
