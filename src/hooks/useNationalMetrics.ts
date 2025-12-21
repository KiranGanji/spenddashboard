import { useMemo } from 'react'
import nationalMetrics from '../data/national_metrics.json'
import type { NationalMetrics } from '../types/metrics'

export const useNationalMetrics = (): NationalMetrics =>
  useMemo(() => nationalMetrics as NationalMetrics, [])
