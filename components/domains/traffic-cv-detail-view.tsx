'use client'

import { DomainHeader } from './domain-header'
import { MetricsGrid } from './metrics-grid'

interface DomainInfo {
  id: string
  domain: string
  title?: string | null
  description?: string | null
  monthly_visits?: string | null
  bounce_rate?: string | null
  global_rank?: string | null
  category_rank?: string | null
  tld?: string | null
  category?: string | null
  country_code?: string | null
  is_adult?: boolean | null
  is_movie?: boolean | null
  is_trending?: boolean | null
  traffic_period?: string | null
  top_countries?: string | null
  top_keywords?: string | null
  monthly_trend?: string | null
}

interface TrafficCvDetailViewProps {
  domain: DomainInfo
}

// 生成模拟的访问量趋势数据
function generateVisitsData(monthlyVisits: string | null) {
  const baseVisits = monthlyVisits ? parseInt(monthlyVisits) : 100000
  
  // 生成最近3个月的数据，显示下降趋势
  const currentMonth = new Date()
  const months = []
  
  for (let i = 2; i >= 0; i--) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1)
    const monthStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`
    
    // 模拟下降趋势
    const multiplier = i === 2 ? 1.5 : i === 1 ? 1.2 : 1.0
    const visits = Math.floor(baseVisits * multiplier)
    
    months.push({
      month: monthStr,
      visits: visits
    })
  }
  
  return months
}

// 计算访问量变化趋势
function calculateTrend(visitsData: Array<{ month: string; visits: number }>) {
  if (visitsData.length < 2) return 0
  
  const latest = visitsData[visitsData.length - 1].visits
  const previous = visitsData[visitsData.length - 2].visits
  
  if (previous === 0) return 0
  
  return ((latest - previous) / previous) * 100
}

export function TrafficCvDetailView({ domain }: TrafficCvDetailViewProps) {
  // 生成访问量趋势数据
  const visitsData = generateVisitsData(domain.monthly_visits)
  
  // 计算访问量变化趋势
  const visitsTrend = calculateTrend(visitsData)
  
  // 构建指标数据
  const metrics = {
    totalVisits: domain.monthly_visits ? parseInt(domain.monthly_visits) : 0,
    avgDuration: 25, // 模拟平均停留时间（秒）
    pagesPerVisit: 2.95, // 模拟每次访问页面数
    bounceRate: domain.bounce_rate ? parseFloat(domain.bounce_rate) : 45.03,
    registrationDate: new Date('2025-04-16'), // 模拟注册日期
    expirationDate: new Date('2026-04-16'), // 模拟过期日期
    visitsTrend: visitsTrend,
  }

  return (
    <div className="container mx-auto py-6">
      {/* Traffic.cv 风格的卡片容器 */}
      <div className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-md mb-4 bg-white p-4 md:p-6 pt-4 space-y-4 md:space-y-6">
        {/* 域名头部 */}
        <div>
          <DomainHeader 
            domain={domain.domain}
            title={domain.title}
            description={domain.description || "Loading description..."}
          />
        </div>

        {/* 指标网格 */}
        <div>
          <MetricsGrid 
            metrics={metrics}
            visitsData={visitsData}
          />
        </div>
      </div>
    </div>
  )
}
