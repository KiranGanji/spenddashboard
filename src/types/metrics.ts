export type MetricDirection = 'up' | 'down'
export type MetricStatus = 'positive' | 'warning' | 'negative'
export type MetricUnit = 'currency' | 'percent' | 'ratio'

export interface MetricDelta {
  value: number
  direction: MetricDirection
}

export interface NationalKpi {
  id:
    | 'totalProjectedMedicalSpend'
    | 'pmpm'
    | 'mcr'
    | 'yoySpendGrowth'
    | 'highCostClaimExposure'
    | 'forecastConfidence'
  label: string
  unit: MetricUnit
  value: number
  delta: MetricDelta
  status: MetricStatus
}

export interface NationalMetrics {
  meta: {
    reportingPeriod: string
    baselineLabel: string
  }
  kpis: NationalKpi[]
}

export type StateRiskLevel = 'Low' | 'Moderate' | 'High'

export interface StateSummary {
  stateCode: string
  stateName: string
  projectedSpend: number
  yoyGrowth: number
  riskLevel: StateRiskLevel
  pmpm: number
  mcr: number
  highCostExposure: number
  forecastConfidence: number
}

export interface StateMetricsResponse {
  meta: {
    reportingPeriod: string
    baselineLabel: string
    source: string
  }
  states: StateSummary[]
}

export type DetailMetricUnit =
  | 'currency'
  | 'percent'
  | 'per1k'
  | 'days'
  | 'members'

export interface LabeledMetric {
  label: string
  value: number
  unit: DetailMetricUnit
}

export interface SpendCompositionSlice {
  category: string
  value: number
}

export interface ForecastComponent {
  driver: string
  value: number
}

export interface StateOverview {
  totalSpend: number
  pmpm: number
  yoyGrowth: number
  shareOfNationalSpend: number
  varianceContribution: number
}

export interface StateDetail {
  stateCode: string
  overview: StateOverview
  composition: SpendCompositionSlice[]
  utilization: LabeledMetric[]
  unitCosts: LabeledMetric[]
  highCostIndicators: LabeledMetric[]
  forecastDecomposition: ForecastComponent[]
  summaryInsights?: { title: string; detail: string }[]
}

export interface NationalSpendPoint {
  quarter: string
  actual?: number
  forecastBase?: number
  forecastLow?: number
  forecastHigh?: number
}

export interface SpendScenario {
  scenario: 'Downside' | 'Base case' | 'Upside'
  spend: number
  driverSummary: string
  interpretation: string
}

export interface MethodologyCategory {
  category: string
  datapoints: string[]
}

export interface NationalSpendDetail {
  summary: {
    label: string
    currentValue: number
    units: string
    confidence: number
  }
  timeSeries: NationalSpendPoint[]
  scenarios: SpendScenario[]
  methodology: MethodologyCategory[]
  takeaway: string
}
