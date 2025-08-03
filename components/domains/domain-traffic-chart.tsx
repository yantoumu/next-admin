'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface TrafficData {
  name: string
  value: number
  color: string
}

interface DomainTrafficChartProps {
  direct: number
  search: number
  social: number
  referral: number
}

export function DomainTrafficChart({
  direct,
  search,
  social,
  referral,
}: DomainTrafficChartProps) {
  const data: TrafficData[] = [
    { name: '直接访问', value: direct, color: '#3b82f6' },
    { name: '搜索引擎', value: search, color: '#10b981' },
    { name: '社交媒体', value: social, color: '#f59e0b' },
    { name: '引荐流量', value: referral, color: '#8b5cf6' },
  ].filter(item => item.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>流量来源分布</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ value }) => `${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}