'use client'

import { ExternalLink, BarChart3, Clock, MousePointerClick, TrendingUp, CalendarPlus, CalendarMinus } from 'lucide-react'

interface DomainData {
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
}

interface SimpleTrafficCvDetailProps {
  domain: DomainData
}

// 指标卡片组件
function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  change 
}: { 
  title: string
  value: string
  icon: any
  change?: { value: string; type: 'increase' | 'decrease' | 'neutral' }
}) {
  return (
    <div className="rounded-md bg-slate-50 p-3 md:p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
            <Icon className="h-4 w-4 text-primary" />
            {title}
          </p>
          <div className="font-semibold mt-2 text-base md:text-xl flex items-center gap-2">
            {value}
            {change && (
              <span className={`ml-1.5 text-sm ${
                change.type === 'increase' ? 'text-green-500' : 
                change.type === 'decrease' ? 'text-red-500' : 'text-gray-500'
              }`}>
                {change.value}
              </span>
            )}
          </div>
        </div>
        <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  )
}

export function SimpleTrafficCvDetail({ domain }: SimpleTrafficCvDetailProps) {
  // 格式化访问量
  const formatVisits = (visits: string | null) => {
    if (!visits) return 'N/A'
    const num = parseInt(visits)
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toString()
  }

  // 模拟访问量变化趋势
  const getVisitsTrend = () => {
    // 模拟下降趋势，类似Traffic.cv的示例
    return {
      value: '-62.59%',
      type: 'decrease' as const
    }
  }

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
                  <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary transition-all duration-200" />
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {domain.title || domain.description || "Loading description..."}
              </p>
            </div>
          </div>
        </div>

        {/* 指标网格 */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* 左侧指标卡片 */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
              <MetricCard
                title="Total Visits"
                value={formatVisits(domain.monthly_visits)}
                icon={BarChart3}
                change={getVisitsTrend()}
              />
              
              <MetricCard
                title="Avg. Duration"
                value="00:00:25"
                icon={Clock}
              />
              
              <MetricCard
                title="Pages per Visit"
                value="2.95"
                icon={MousePointerClick}
              />
              
              <MetricCard
                title="Bounce Rate"
                value={`${domain.bounce_rate || '45.03'}%`}
                icon={TrendingUp}
              />
              
              <MetricCard
                title="Registration"
                value="2025-4-16"
                icon={CalendarPlus}
              />
              
              <MetricCard
                title="Expiration"
                value="2026-4-16"
                icon={CalendarMinus}
              />
            </div>

            {/* 右侧图表占位符 */}
            <div className="lg:col-span-2">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Visits Over Time</span>
                </div>
                <div className="w-full h-[172px] bg-slate-50 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Chart Coming Soon</p>
                    <p className="text-xs text-gray-400 mt-1">Traffic.cv Style</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 额外信息区域 */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Domain Info</h3>
              <div className="space-y-1 text-sm">
                <div><span className="text-gray-500">TLD:</span> {domain.tld || 'N/A'}</div>
                <div><span className="text-gray-500">Category:</span> {domain.category || 'N/A'}</div>
                <div><span className="text-gray-500">Country:</span> {domain.country_code || 'N/A'}</div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Rankings</h3>
              <div className="space-y-1 text-sm">
                <div><span className="text-gray-500">Global:</span> #{domain.global_rank || 'N/A'}</div>
                <div><span className="text-gray-500">Category:</span> #{domain.category_rank || 'N/A'}</div>
                <div><span className="text-gray-500">Monthly Visits:</span> {formatVisits(domain.monthly_visits)}</div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {domain.is_trending && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Trending</span>
                )}
                {domain.is_adult && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Adult</span>
                )}
                {domain.is_movie && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Movie</span>
                )}
                {!domain.is_trending && !domain.is_adult && !domain.is_movie && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Standard</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
