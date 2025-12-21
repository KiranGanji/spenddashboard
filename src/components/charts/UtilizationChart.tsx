import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import { LabeledMetric } from '../../types/metrics'
import { formatMetricValue } from '../../utils/formatters'

type UtilizationChartProps = {
  data: LabeledMetric[]
}

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null
  const { label, unit, value } = payload[0].payload as LabeledMetric & { displayValue: number }
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className="text-slate-700">{formatMetricValue(Number(value), unit)}</p>
    </div>
  )
}

export const UtilizationChart = ({ data }: UtilizationChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    displayValue: item.unit === 'percent' ? item.value * 100 : item.value,
    formattedLabel: formatMetricValue(item.value, item.unit),
  }))

  return (
    <div className="h-[280px]">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#475569' }}
            height={50}
            interval={0}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: '#475569' }} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="displayValue" radius={[6, 6, 6, 6]} fill="#1e52c0">
            <LabelList
              dataKey="formattedLabel"
              position="top"
              fill="#0f172a"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
