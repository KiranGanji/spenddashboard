import { useMemo } from 'react'
import spendDetail from '../data/national_spend_detail.json'
import type { NationalSpendDetail } from '../types/metrics'

export const useNationalSpendDetail = () =>
  useMemo(() => spendDetail as NationalSpendDetail, [])
