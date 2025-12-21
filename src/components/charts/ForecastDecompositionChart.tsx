import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import type { ForecastComponent } from '../../types/metrics'
import { formatPercent } from '../../utils/formatters'

type ForecastDecompositionChartProps = {
  data: ForecastComponent[]
}

const COLORS = ['#1e52c0', '#4f86f7', '#93c5fd', '#cbd5ff']

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-slate-900">{name}</p>
      <p className="text-slate-700">{formatPercent(Number(value) / 100)}</p>
    </div>
  )
}

export const ForecastDecompositionChart = ({ data }: ForecastDecompositionChartProps) => {
  const stacked = [
    data.reduce<Record<string, number | string>>(
      (acc, component) => {
        acc[component.driver] = component.value * 100
        return acc
      },
      { name: 'Drivers' },
    ),
  ]

  return (
    <div className="h-[280px]">
      <ResponsiveContainer>
        <BarChart data={stacked}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} tickLine={false} />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 12, fill: '#475569' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {data.map((component, idx) => (
            <Bar
              key={component.driver}
              dataKey={component.driver}
              stackId="growth"
              fill={COLORS[idx % COLORS.length]}
              radius={idx === data.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
