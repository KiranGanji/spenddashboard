import { useCallback, useMemo, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import usStates from 'us-atlas/states-10m.json'
import fipsMap from '../data/state_fips.json'
import type { StateSummary } from '../types/metrics'
import { formatMetricValue, formatPercent } from '../utils/formatters'
import { getGrowthColor, growthLegend, riskColors } from '../utils/colors'

type USHeatMapProps = {
  states: StateSummary[]
  onStateSelect: (stateCode: string) => void
  selectedStateCode?: string
}

type HoverState = {
  name: string
  code: string
  projectedSpend?: number
  yoyGrowth?: number
  riskLevel?: string
  position: { x: number; y: number }
}

export const USHeatMap = ({
  states,
  onStateSelect,
  selectedStateCode,
}: USHeatMapProps) => {
  const geography = useMemo(
    () =>
      feature(
        usStates as unknown as Topology,
        (usStates as { objects: { states: GeometryCollection } }).objects.states,
      ),
    [],
  )

  const stateByCode = useMemo(
    () =>
      states.reduce<Record<string, StateSummary>>((acc, entry) => {
        acc[entry.stateCode] = entry
        return acc
      }, {}),
    [states],
  )

  const fipsToState = useMemo(
    () =>
      (fipsMap as { fips: string; code: string; name: string }[]).reduce<
        Record<string, { code: string; name: string }>
      >((acc, entry) => {
        acc[entry.fips] = { code: entry.code, name: entry.name }
        return acc
      }, {}),
    [],
  )

  const [hoverInfo, setHoverInfo] = useState<HoverState | null>(null)

  const handleEnter = useCallback(
    (evt: ReactMouseEvent<SVGPathElement>, geographyId: string | number) => {
      const mapEntry = fipsToState[String(geographyId).padStart(2, '0')]
      if (!mapEntry) return
      const metrics = stateByCode[mapEntry.code]
      setHoverInfo({
        name: mapEntry.name,
        code: mapEntry.code,
        projectedSpend: metrics?.projectedSpend,
        yoyGrowth: metrics?.yoyGrowth,
        riskLevel: metrics?.riskLevel,
        position: { x: evt.clientX, y: evt.clientY },
      })
    },
    [fipsToState, stateByCode],
  )

  const handleLeave = useCallback(() => setHoverInfo(null), [])

  const handleClick = useCallback(
    (geographyId: string | number) => {
      const mapEntry = fipsToState[String(geographyId).padStart(2, '0')]
      if (!mapEntry) return
      onStateSelect(mapEntry.code)
    },
    [fipsToState, onStateSelect],
  )

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ocean-600">
            Projected growth
          </p>
          <h3 className="text-lg font-semibold text-slate-900">
            YoY Medical Spend Growth by State
          </h3>
          <p className="text-sm text-slate-500">
            Click a state to open the drill-down panel.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-full bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-slate-300" /> No data
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-ocean-500" /> Higher growth
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/40">
          <ComposableMap projection="geoAlbersUsa" width={900} height={520}>
            <Geographies geography={geography}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => {
                  const fips = String(geo.id).padStart(2, '0')
                  const stateMeta = fipsToState[fips]
                  const metrics = stateMeta ? stateByCode[stateMeta.code] : undefined
                  const fillColor = metrics ? getGrowthColor(metrics.yoyGrowth) : '#e2e8f0'
                  const isSelected = selectedStateCode === stateMeta?.code

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(evt) => handleEnter(evt, geo.id)}
                      onMouseLeave={handleLeave}
                      onClick={() => handleClick(geo.id)}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: isSelected ? '#1d4ed8' : '#ffffff',
                          strokeWidth: isSelected ? 2 : 1,
                          outline: 'none',
                        },
                        hover: {
                          fill: metrics ? '#1e52c0' : '#cbd5e1',
                          stroke: '#0f172a',
                          strokeWidth: 1.2,
                          outline: 'none',
                        },
                        pressed: {
                          fill: '#1d4ed8',
                          stroke: '#0f172a',
                          strokeWidth: 1.4,
                          outline: 'none',
                        },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Growth Legend</p>
          <div className="flex flex-col gap-2 text-xs text-slate-600">
            {growthLegend.map((band) => (
              <div key={band.label} className="flex items-center gap-2">
                <span
                  className="h-3 w-6 rounded-full"
                  style={{ background: band.color }}
                  aria-hidden
                />
                <span>{band.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {hoverInfo ? (
        <div
          className="pointer-events-none fixed z-40 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-sm shadow-lg"
          style={{ left: hoverInfo.position.x + 12, top: hoverInfo.position.y - 12 }}
        >
          <p className="font-semibold text-slate-900">
            {hoverInfo.name}{' '}
            <span className="text-xs text-slate-500">({hoverInfo.code})</span>
          </p>
          <p className="text-xs text-slate-500">Projected Spend</p>
          <p className="font-medium text-slate-900">
            {hoverInfo.projectedSpend
              ? formatMetricValue(hoverInfo.projectedSpend, 'currency', { compactCurrency: true })
              : '—'}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-ocean-700">
              {hoverInfo.yoyGrowth !== undefined ? formatPercent(hoverInfo.yoyGrowth) : '—'}
            </span>
            {hoverInfo.riskLevel ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-semibold">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: riskColors[hoverInfo.riskLevel as keyof typeof riskColors] }}
                />
                {hoverInfo.riskLevel}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
