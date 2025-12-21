import { useMemo } from 'react'
import ca from '../data/state_detail_CA.json'
import tx from '../data/state_detail_TX.json'
import ny from '../data/state_detail_NY.json'
import fl from '../data/state_detail_FL.json'
import il from '../data/state_detail_IL.json'
import { StateDetail } from '../types/metrics'

const detailMap: Record<string, StateDetail> = {
  CA: ca as StateDetail,
  TX: tx as StateDetail,
  NY: ny as StateDetail,
  FL: fl as StateDetail,
  IL: il as StateDetail,
}

export const availableDetailStates = Object.keys(detailMap)

export const useStateDetail = (stateCode?: string) =>
  useMemo(() => {
    if (!stateCode) return { detail: undefined, hasDetail: false }
    const detail = detailMap[stateCode]
    return { detail, hasDetail: Boolean(detail) }
  }, [stateCode])
