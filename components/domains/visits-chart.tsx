'use client'

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { ChartSpline } from 'lucide-react'

interface VisitsChartProps {
  data: Array<{
    month: string
    visits: number
  }>
}

export function VisitsChart({ data }: VisitsChartProps) {
  // 格式化数值显示
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return value.toString()
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ChartSpline className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Visits Over Time</span>
      </div>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={172}>
          <AreaChart
            data={data}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6468f0" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#6468f0" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#eaeaea" 
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#777' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#777' }}
              tickFormatter={formatValue}
              width={60}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px'
              }}
              formatter={(value: number) => [formatValue(value), 'Visits']}
              labelStyle={{ color: '#333' }}
            />
            <Area
              type="monotone"
              dataKey="visits"
              stroke="#6468f0"
              strokeWidth={2}
              fill="url(#colorVisits)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
