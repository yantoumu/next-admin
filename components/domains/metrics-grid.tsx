'use client'

import {
  BarChart3,
  Clock,
  MousePointerClick,
  TrendingUp,
  CalendarPlus,
  CalendarMinus
} from 'lucide-react'
import { MetricCard } from './metric-card'
import { VisitsChart } from './visits-chart'
import { format } from 'date-fns'

interface DomainMetrics {
  totalVisits: number
  avgDuration: number // 秒
  pagesPerVisit: number
  bounceRate: number // 百分比
  registrationDate?: Date
  expirationDate?: Date
  visitsTrend?: number // 百分比变化
}

interface MetricsGridProps {
  metrics: DomainMetrics
  visitsData: Array<{
    month: string
    visits: number
  }>
}

export function MetricsGrid({ metrics, visitsData }: MetricsGridProps) {
  // 格式化访问量
  const formatVisits = (visits: number) => {
    if (visits >= 1000000) {
      return `${(visits / 1000000).toFixed(2)}M`
    }
    if (visits >= 1000) {
      return `${(visits / 1000).toFixed(2)}K`
    }
    return visits.toString()
  }

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `00:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 格式化日期
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A'
    return format(date, 'yyyy-M-d')
  }

  // 格式化趋势变化
  const formatTrend = (trend?: number) => {
    if (trend === undefined) return undefined
    
    const sign = trend >= 0 ? '+' : ''
    return {
      value: `${sign}${trend.toFixed(2)}%`,
      type: trend > 0 ? 'increase' as const : trend < 0 ? 'decrease' as const : 'neutral' as const
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* 左侧指标卡片 */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Visits"
          value={formatVisits(metrics.totalVisits)}
          icon={BarChart3}
          change={formatTrend(metrics.visitsTrend)}
        />
        
        <MetricCard
          title="Avg. Duration"
          value={formatDuration(metrics.avgDuration)}
          icon={Clock}
        />
        
        <MetricCard
          title="Pages per Visit"
          value={metrics.pagesPerVisit.toFixed(2)}
          icon={MousePointerClick}
        />
        
        <MetricCard
          title="Bounce Rate"
          value={`${metrics.bounceRate.toFixed(2)}%`}
          icon={TrendingUp}
        />
        
        <MetricCard
          title="Registration"
          value={formatDate(metrics.registrationDate)}
          icon={CalendarPlus}
        />
        
        <MetricCard
          title="Expiration"
          value={formatDate(metrics.expirationDate)}
          icon={CalendarMinus}
        />
      </div>

      {/* 右侧图表 */}
      <div className="lg:col-span-2">
        <VisitsChart data={visitsData} />
      </div>
    </div>
  )
}
