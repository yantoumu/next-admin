'use client'

import { ExternalLink, BarChart3, Clock, MousePointerClick, TrendingUp, CalendarPlus, CalendarMinus, ChartSpline } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { format } from 'date-fns'

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

interface TrafficCvStyleDetailProps {
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

// 访问量趋势图表组件
function VisitsChart({ data }: { data: Array<{ month: string; visits: number }> }) {
  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
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
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6468f0" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#6468f0" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" horizontal={true} vertical={false} />
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

export function TrafficCvStyleDetail({ domain }: TrafficCvStyleDetailProps) {
  // 生成模拟的访问量趋势数据
  const generateVisitsData = () => {
    const baseVisits = domain.monthly_visits ? parseInt(domain.monthly_visits) : 100000
    return [
      { month: '2025/04', visits: Math.floor(baseVisits * 1.5) },
      { month: '2025/05', visits: Math.floor(baseVisits * 1.2) },
      { month: '2025/06', visits: baseVisits },
    ]
  }

  const visitsData = generateVisitsData()
  
  // 格式化访问量
  const formatVisits = (visits: string | null) => {
    if (!visits) return 'N/A'
    const num = parseInt(visits)
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toString()
  }

  // 计算访问量变化趋势
  const calculateTrend = () => {
    if (visitsData.length < 2) return undefined
    const latest = visitsData[visitsData.length - 1].visits
    const previous = visitsData[visitsData.length - 2].visits
    if (previous === 0) return undefined
    const change = ((latest - previous) / previous) * 100
    return {
      value: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
      type: change > 0 ? 'increase' as const : change < 0 ? 'decrease' as const : 'neutral' as const
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
                change={calculateTrend()}
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

            {/* 右侧图表 */}
            <div className="lg:col-span-2">
              <VisitsChart data={visitsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
