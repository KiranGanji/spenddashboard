import {
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import type { SpendCompositionSlice } from '../../types/metrics'
import { formatMetricValue } from '../../utils/formatters'

type SpendCompositionChartProps = {
  data: SpendCompositionSlice[]
}

const COLORS = ['#1e52c0', '#4f86f7', '#93c5fd', '#cbd5ff']

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-slate-900">{name}</p>
      <p className="text-slate-700">
        {formatMetricValue(Number(value), 'currency', { compactCurrency: true })}
      </p>
    </div>
  )
}

export const SpendCompositionChart = ({ data }: SpendCompositionChartProps) => (
  <div className="h-[280px]">
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
        >
          {data.map((entry, idx) => (
            <Cell key={entry.category} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
)
