'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface TrafficDataPoint {
  date: string
  visits: number
  bounceRate: number
}

interface DomainTrendChartProps {
  domainName: string
  data?: TrafficDataPoint[]
  loading?: boolean
  period?: '7d' | '30d' | '90d'
  onPeriodChange?: (period: '7d' | '30d' | '90d') => void
}

export function DomainTrendChart({
  domainName,
  data = [],
  loading = false,
  period = '30d',
  onPeriodChange,
}: DomainTrendChartProps) {
  const [metric, setMetric] = useState<'visits' | 'bounceRate'>('visits')

  const formatYAxis = (value: number) => {
    if (metric === 'visits') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
      return value.toString()
    }
    return `${value}%`
  }

  const formatTooltipValue = (value: number) => {
    if (metric === 'visits') {
      return value.toLocaleString() + ' 访问'
    }
    return value.toFixed(2) + '%'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>流量趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{domainName} - 流量趋势</CardTitle>
          <div className="flex gap-2">
            <Select value={metric} onValueChange={(v) => setMetric(v as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visits">访问量</SelectItem>
                <SelectItem value="bounceRate">跳出率</SelectItem>
              </SelectContent>
            </Select>
            {onPeriodChange && (
              <Select value={period} onValueChange={onPeriodChange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7天</SelectItem>
                  <SelectItem value="30d">30天</SelectItem>
                  <SelectItem value="90d">90天</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip 
                formatter={formatTooltipValue}
                labelFormatter={(label) => `日期: ${label}`}
              />
              <Line
                type="monotone"
                dataKey={metric}
                stroke={metric === 'visits' ? '#3b82f6' : '#ef4444'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}