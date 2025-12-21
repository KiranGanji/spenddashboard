import { Fragment, type ReactNode } from 'react'
import type { StateDetail, StateSummary } from '../types/metrics'
import { useStateDetail } from '../hooks/useStateDetail'
import { formatMetricValue, formatPercent } from '../utils/formatters'
import { riskColors } from '../utils/colors'
import { SpendCompositionChart } from './charts/SpendCompositionChart'
import { UtilizationChart } from './charts/UtilizationChart'
import { ForecastDecompositionChart } from './charts/ForecastDecompositionChart'

type StateDrilldownProps = {
  stateCode?: string
  stateSummary?: StateSummary
  isOpen: boolean
  onClose: () => void
}

const OverviewItem = ({
  label,
  value,
  unit,
}: {
  label: string
  value: number
  unit: 'currency' | 'percent'
}) => (
  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="text-lg font-semibold text-slate-900">
      {formatMetricValue(value, unit, { compactCurrency: unit === 'currency' })}
    </p>
  </div>
)

const MetricPill = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
    {label}: {value}
  </div>
)

export const StateDrilldown = ({
  stateCode,
  stateSummary,
  isOpen,
  onClose,
}: StateDrilldownProps) => {
  const { detail, hasDetail } = useStateDetail(stateCode)
  if (!isOpen) return null

  const headerTitle =
    stateSummary?.stateName ?? detail?.stateCode ?? stateCode ?? 'Select a state'

  const renderOverview = (stateDetail: StateDetail) => (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      <OverviewItem label="Total Spend" unit="currency" value={stateDetail.overview.totalSpend} />
      <OverviewItem label="PMPM" unit="currency" value={stateDetail.overview.pmpm} />
      <OverviewItem label="YoY Growth" unit="percent" value={stateDetail.overview.yoyGrowth} />
      <OverviewItem
        label="Share of National Spend"
        unit="percent"
        value={stateDetail.overview.shareOfNationalSpend}
      />
      <OverviewItem
        label="Contribution to National Variance"
        unit="percent"
        value={stateDetail.overview.varianceContribution}
      />
    </div>
  )

  return (
    <div className="fixed inset-0 z-40 flex items-stretch justify-center">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 my-6 flex h-full w-full max-w-5xl flex-col overflow-y-auto rounded-3xl bg-white px-6 py-6 shadow-2xl scrollbar-thin sm:h-auto sm:max-h-[90vh] md:px-10">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ocean-600">
              State drill-down
            </p>
            <h3 className="text-2xl font-semibold text-slate-900">{headerTitle}</h3>
            {stateSummary ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <MetricPill
                  label="Projected spend"
                  value={formatMetricValue(stateSummary.projectedSpend, 'currency')}
                />
                <MetricPill label="YoY growth" value={formatPercent(stateSummary.yoyGrowth)} />
                <MetricPill
                  label="Risk"
                  value={
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: riskColors[stateSummary.riskLevel] }}
                      />
                      {stateSummary.riskLevel}
                    </span>
                  }
                />
              </div>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {!hasDetail ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-700">
            No detailed drill-down is available for this state yet. Try California, Texas, New York,
            Florida, or Illinois.
          </div>
        ) : (
          <Fragment>
            <section className="mt-6 space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                State Spend Overview
              </h4>
              {detail && renderOverview(detail)}
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900">Spend Composition</h4>
                  <p className="text-xs text-slate-500">Inpatient, Outpatient, Professional, Rx</p>
                </div>
                <SpendCompositionChart data={detail?.composition ?? []} />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900">Utilization Metrics</h4>
                  <p className="text-xs text-slate-500">Rates per 1K members</p>
                </div>
                <UtilizationChart data={detail?.utilization ?? []} />
              </div>
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-900">Unit Cost Metrics</h4>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {detail?.unitCosts.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      <p className="text-xs text-slate-500">{metric.label}</p>
                      <p className="text-base font-semibold text-slate-900">
                        {formatMetricValue(metric.value, metric.unit, { compactCurrency: false })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-900">High-Cost Claim Indicators</h4>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {detail?.highCostIndicators.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      <p className="text-xs text-slate-500">{metric.label}</p>
                      <p className="text-base font-semibold text-slate-900">
                        {formatMetricValue(metric.value, metric.unit, { compactCurrency: false })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">Forecast Decomposition</h4>
                <p className="text-xs text-slate-500">
                  Utilization, unit cost, case mix, membership
                </p>
              </div>
              <ForecastDecompositionChart data={detail?.forecastDecomposition ?? []} />
            </section>
          </Fragment>
        )}
      </div>
    </div>
  )
}
