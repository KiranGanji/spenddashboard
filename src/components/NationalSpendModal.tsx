import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import type {
  MethodologyCategory,
  NationalSpendDetail,
  SpendScenario,
} from '../types/metrics'
import { formatMetricValue, formatPercent } from '../utils/formatters'

type NationalSpendModalProps = {
  detail: NationalSpendDetail
  isOpen: boolean
  onClose: () => void
}

const SpendTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null
  const base = payload.find((p) => p.dataKey === 'forecastBase')?.value
  const low = payload.find((p) => p.dataKey === 'forecastLow')?.value
  const high = payload.find((p) => p.dataKey === 'forecastHigh')?.value
  const actual = payload.find((p) => p.dataKey === 'actual')?.value

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-slate-900">{label}</p>
      {actual !== undefined ? (
        <p className="text-slate-700">
          Actual: {formatMetricValue(Number(actual) * 1_000_000_000, 'currency')}
        </p>
      ) : null}
      {base !== undefined ? (
        <p className="text-slate-700">
          Forecast: {formatMetricValue(Number(base) * 1_000_000_000, 'currency')} (range{' '}
          {formatMetricValue(Number(low ?? base) * 1_000_000_000, 'currency')} -{' '}
          {formatMetricValue(Number(high ?? base) * 1_000_000_000, 'currency')})
        </p>
      ) : null}
    </div>
  )
}

const ScenarioCard = ({ scenario }: { scenario: SpendScenario }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {scenario.scenario}
    </p>
    <p className="text-xl font-semibold text-slate-900">
      {formatMetricValue(scenario.spend, 'currency')}
    </p>
    <p className="mt-1 text-sm text-slate-700">{scenario.driverSummary}</p>
    <p className="mt-1 text-xs text-slate-500">{scenario.interpretation}</p>
  </div>
)

const MethodologyCard = ({ item }: { item: MethodologyCategory }) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
    <p className="text-sm font-semibold text-slate-900">{item.category}</p>
    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">
      {item.datapoints.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
  </div>
)

export const NationalSpendModal = ({ detail, isOpen, onClose }: NationalSpendModalProps) => {
  if (!isOpen) return null

  const toBillions = (value?: number) =>
    value === undefined ? undefined : Number((value / 1_000_000_000).toFixed(1))

  const chartData = detail.timeSeries.map((point) => ({
    quarter: point.quarter,
    actual: toBillions(point.actual),
    forecastBase: toBillions(point.forecastBase),
    forecastLow: toBillions(point.forecastLow),
    forecastHigh: toBillions(point.forecastHigh),
    forecastRange:
      point.forecastHigh !== undefined && point.forecastLow !== undefined
        ? toBillions(point.forecastHigh - point.forecastLow)
        : undefined,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 my-6 flex h-full w-full max-w-6xl flex-col overflow-y-auto rounded-3xl bg-white px-6 py-6 shadow-2xl scrollbar-thin sm:h-auto sm:max-h-[92vh] md:px-10">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ocean-600">
              Total Projected Medical Spend
            </p>
            <h3 className="text-2xl font-semibold text-slate-900">
              {formatMetricValue(detail.summary.currentValue, 'currency')}
            </h3>
            <p className="text-sm text-slate-600">
              Confidence: {formatPercent(detail.summary.confidence)} • {detail.summary.label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">
              Trend and forecast range (last 10 quarters)
            </h4>
            <p className="text-xs text-slate-500">
              Actuals through FY24 Q4, forecast FY25 with range band
            </p>
          </div>
          <div className="mt-3 h-[260px]">
            <ResponsiveContainer>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis
                  tickFormatter={(v) => `$${Number(v).toFixed(0)}B`}
                  tick={{ fontSize: 11, fill: '#475569' }}
                />
                <Tooltip content={<SpendTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <defs>
                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cbd5ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#cbd5ff" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="forecastLow"
                  stroke="none"
                  fill="transparent"
                  stackId="forecastBand"
                  name="Forecast low"
                  connectNulls
                  legendType="none"
                />
                <Area
                  type="monotone"
                  dataKey="forecastRange"
                  stroke="none"
                  fill="url(#forecastGradient)"
                  stackId="forecastBand"
                  name="Forecast range"
                  connectNulls
                />
                <Bar
                  dataKey="actual"
                  fill="#0f172a"
                  name="Actual"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="forecastBase"
                  fill="#1e52c0"
                  name="Forecast base"
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Spend range summary</h4>
              <p className="text-xs text-slate-500">
                What moves the number: more people using care vs. care getting more expensive
              </p>
            </div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {detail.scenarios.map((scenario) => (
              <ScenarioCard key={scenario.scenario} scenario={scenario} />
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900">Forecasting methodology</h4>
          <p className="text-xs text-slate-500">
            Signals ingested and models applied to explain and forecast medical spend
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {detail.methodology.map((item) => (
              <MethodologyCard key={item.category} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 shadow-sm">
          <p className="text-sm font-semibold text-amber-900">Takeaway</p>
          <p className="mt-1 text-sm text-amber-800">{detail.takeaway}</p>
        </section>
      </div>
    </div>
  )
}
