import { useMemo, useState } from 'react'
import { MetricsBar } from './components/MetricsBar'
import { USHeatMap } from './components/USHeatMap'
import { StateDrilldown } from './components/StateDrilldown'
import { useStateMetrics } from './hooks/useStateMetrics'
import type { StateSummary } from './types/metrics'
import { formatMetricValue, formatPercent } from './utils/formatters'

function App() {
  const { states } = useStateMetrics()
  const [selectedStateCode, setSelectedStateCode] = useState<string | undefined>()

  const stateByCode = useMemo(
    () =>
      states.reduce<Record<string, StateSummary>>((acc, state) => {
        acc[state.stateCode] = state
        return acc
      }, {}),
    [states],
  )

  const selectedState = selectedStateCode ? stateByCode[selectedStateCode] : undefined

  const summary = useMemo(() => {
    if (!states.length) return null
    const averageGrowth =
      states.reduce((total, state) => total + state.yoyGrowth, 0) / states.length
    const highRiskStates = states.filter((state) => state.riskLevel === 'High')
    const moderateRiskStates = states.filter((state) => state.riskLevel === 'Moderate')
    const topGrowthStates = [...states]
      .sort((a, b) => b.yoyGrowth - a.yoyGrowth)
      .slice(0, 5)
    const topSpendStates = [...states].sort((a, b) => b.projectedSpend - a.projectedSpend).slice(0, 3)

    return {
      averageGrowth,
      highRiskCount: highRiskStates.length,
      moderateRiskCount: moderateRiskStates.length,
      topGrowthStates,
      topSpendStates,
    }
  }, [states])

  const openState = (code: string) => {
    setSelectedStateCode(code)
  }

  const closeDrawer = () => setSelectedStateCode(undefined)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/80 to-slate-50">
      <main className="mx-auto max-w-6xl px-6 py-6">
        <header className="mb-4 flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-ocean-600">
            Medical Spend Forecasting
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Enterprise dashboard for executive visibility
          </h1>
          <p className="text-sm text-slate-600">
            Data-driven outlook of projected medical spend, YoY growth, and risk concentrations with
            state-level drill-downs.
          </p>
        </header>

        <MetricsBar />

        <section className="mt-4">
          <USHeatMap
            states={states}
            selectedStateCode={selectedStateCode}
            onStateSelect={openState}
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  National context
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Growth distribution snapshot
                </h3>
              </div>
            </div>
            {summary ? (
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">Average YoY growth</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatPercent(summary.averageGrowth)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">High-risk states</p>
                  <p className="text-lg font-semibold text-rose-600">{summary.highRiskCount}</p>
                  <p className="text-xs text-slate-500">
                    Moderate risk: {summary.moderateRiskCount}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Top growth states</h3>
              <p className="text-xs text-slate-500">Click map or select here</p>
            </div>
            <div className="mt-2 space-y-2">
              {summary?.topGrowthStates.map((state) => (
                <button
                  key={state.stateCode}
                  onClick={() => openState(state.stateCode)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {state.stateName} ({state.stateCode})
                    </p>
                    <p className="text-xs text-slate-500">
                      Spend {formatMetricValue(state.projectedSpend, 'currency')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ocean-700">
                      {formatPercent(state.yoyGrowth)}
                    </p>
                    <p className="text-xs text-slate-500">{state.riskLevel} risk</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <h3 className="text-lg font-semibold text-slate-900">Top spend concentration</h3>
            <div className="mt-2 space-y-2">
              {summary?.topSpendStates.map((state) => (
                <div
                  key={state.stateCode}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                >
                  <div className="font-semibold text-slate-900">
                    {state.stateName} ({state.stateCode})
                  </div>
                  <div className="text-sm text-slate-700">
                    {formatMetricValue(state.projectedSpend, 'currency')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <StateDrilldown
        stateCode={selectedStateCode}
        stateSummary={selectedState}
        isOpen={Boolean(selectedStateCode)}
        onClose={closeDrawer}
      />
    </div>
  )
}

export default App
