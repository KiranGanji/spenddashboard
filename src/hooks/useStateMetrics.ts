import { useMemo } from 'react'
import stateMetrics from '../data/state_metrics.json'
import { StateMetricsResponse, StateSummary } from '../types/metrics'

export const useStateMetrics = () => {
  const parsed = useMemo(() => stateMetrics as StateMetricsResponse, [])

  const byCode = useMemo(
    () =>
      parsed.states.reduce<Map<string, StateSummary>>((acc, state) => {
        acc.set(state.stateCode, state)
        return acc
      }, new Map()),
    [parsed.states],
  )

  const growthRange = useMemo(() => {
    if (!parsed.states.length) return { min: 0, max: 0 }
    const growthValues = parsed.states.map((s) => s.yoyGrowth)
    return { min: Math.min(...growthValues), max: Math.max(...growthValues) }
  }, [parsed.states])

  return {
    meta: parsed.meta,
    states: parsed.states,
    byCode,
    growthRange,
  }
}
