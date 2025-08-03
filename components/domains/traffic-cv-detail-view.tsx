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
  return (
    <div className="container mx-auto py-6">
      {/* Traffic.cv 风格的卡片容器 */}
      <div className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-md mb-4 bg-white p-4 md:p-6 pt-4 space-y-4 md:space-y-6">
        {/* 域名头部 */}
        <div>
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-0.5 text-2xl font-bold">
                <h2 className="pb-1.5">{domain.domain}</h2>
                <a
                  href={`https://${domain.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1.5 p-1.5 text-foreground flex items-center justify-center hover:bg-gray-100 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground hover:text-primary transition-all duration-200">
                    <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"></path>
                    <path d="m21 3-9 9"></path>
                    <path d="M15 3h6v6"></path>
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {domain.title || domain.description || "Loading description..."}
              </p>
            </div>
          </div>
        </div>

        {/* 简化的指标展示 */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <p className="text-sm font-medium text-gray-500">Total Visits</p>
                <div className="font-semibold mt-2 text-base md:text-xl">
                  {domain.monthly_visits ? `${(parseInt(domain.monthly_visits) / 1000000).toFixed(2)}M` : 'N/A'}
                </div>
              </div>

              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <p className="text-sm font-medium text-gray-500">Bounce Rate</p>
                <div className="font-semibold mt-2 text-base md:text-xl">
                  {domain.bounce_rate || '45.03'}%
                </div>
              </div>

              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <p className="text-sm font-medium text-gray-500">Global Rank</p>
                <div className="font-semibold mt-2 text-base md:text-xl">
                  #{domain.global_rank || 'N/A'}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-sm font-medium text-gray-500 mb-4">Domain Info</p>
                <div className="space-y-2">
                  <div><span className="text-xs text-gray-400">TLD:</span> {domain.tld}</div>
                  <div><span className="text-xs text-gray-400">Category:</span> {domain.category}</div>
                  <div><span className="text-xs text-gray-400">Country:</span> {domain.country_code}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
