'use client'

import { 
  ChartBarBig, 
  Clock, 
  MousePointerClick, 
  TrendingUp, 
  CalendarPlus, 
  CalendarMinus,
  ChartSpline,
  SquareArrowOutUpRight 
} from 'lucide-react'
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts'

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

interface TrafficCvExactReplicaProps {
  domain: DomainData
}

export function TrafficCvExactReplica({ domain }: TrafficCvExactReplicaProps) {
  // 生成访问量趋势数据 - 完全模拟Traffic.cv的数据结构
  const visitsData = [
    { month: '2025/04', visits: 580000 },
    { month: '2025/05', visits: 320000 },
    { month: '2025/06', visits: 148420 },
  ]

  // 格式化访问量 - 完全按照Traffic.cv的格式
  const formatVisits = (visits: string | null) => {
    if (!visits) return '148.42K'
    const num = parseInt(visits)
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toString()
  }

  return (
    <div className="container mx-auto py-6">
      {/* 完全复刻Traffic.cv的主容器样式 */}
      <div className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-md mb-4 bg-white p-4 md:p-6 pt-4 space-y-4 md:space-y-6">
        
        {/* 域名头部 - 完全按照Traffic.cv的结构 */}
        <div>
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-0.5 text-2xl font-bold">
                <h2 className="pb-1.5">{domain.domain}</h2>
                <a 
                  href={`https://${domain.domain}`} 
                  target="_blank" 
                  className="ml-1.5 p-1.5 text-foreground flex items-center justify-center hover:bg-gray-100 rounded-md"
                >
                  <SquareArrowOutUpRight className="h-4 w-4 text-muted-foreground hover:text-primary transition-all duration-200" />
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {domain.title || domain.description || "Loading description..."}
              </p>
            </div>
            <a 
              href={`/${domain.domain}`} 
              className="w-full md:w-auto mt-3 md:mt-0 bg-primary/10 sm:w-auto sm:bg-transparent rounded-md p-2 text-sm text-primary transition-all duration-200 min-w-30 text-center sm:text-right"
            >
              View Details
            </a>
          </div>
        </div>

        {/* 指标网格 - 完全按照Traffic.cv的布局 */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* 左侧指标卡片 - lg:col-span-3 */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
              
              {/* Total Visits - 完全复刻样式 */}
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
                        <ChartBarBig className="h-4 w-4 text-primary" />
                        Total Visits
                      </p>
                      <div className="font-semibold mt-2 text-base md:text-xl">
                        {formatVisits(domain.monthly_visits)}
                        <span className="ml-1.5 text-sm text-red-500">-62.59%</span>
                      </div>
                    </div>
                    <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                      <ChartBarBig className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Avg. Duration */}
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
                        <Clock className="h-4 w-4 text-primary" />
                        Avg. Duration
                      </p>
                      <div className="font-semibold mt-2 text-base md:text-xl">00:00:25</div>
                    </div>
                    <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pages per Visit */}
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
                        <MousePointerClick className="h-4 w-4 text-primary" />
                        Pages per Visit
                      </p>
                      <div className="font-semibold mt-2 text-base md:text-xl">2.95</div>
                    </div>
                    <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                      <MousePointerClick className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bounce Rate */}
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Bounce Rate
                      </p>
                      <div className="font-semibold mt-2 text-base md:text-xl">
                        {domain.bounce_rate || '45.03'}%
                      </div>
                    </div>
                    <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration */}
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
                        <CalendarPlus className="h-4 w-4 text-primary" />
                        Registration
                      </p>
                      <div className="font-semibold mt-2 text-base md:text-xl">2025-4-16</div>
                    </div>
                    <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                      <CalendarPlus className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expiration */}
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
                        <CalendarMinus className="h-4 w-4 text-primary" />
                        Expiration
                      </p>
                      <div className="font-semibold mt-2 text-base md:text-xl">2026-4-16</div>
                    </div>
                    <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                      <CalendarMinus className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 右侧图表 - lg:col-span-2 */}
            <div className="lg:col-span-2">
              <div className="">
                <div className="flex items-center gap-2 mb-4">
                  <ChartSpline className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Visits Over Time</span>
                </div>
                <div className="w-full">
                  {/* 完全复刻Recharts配置 */}
                  <div 
                    data-slot="chart" 
                    data-chart="chart-replica" 
                    className="[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden max-h-[172px] w-full"
                  >
                    <ResponsiveContainer width="100%" height={172}>
                      <AreaChart data={visitsData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6468f0" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#6468f0" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#777' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#777' }}
                          tickFormatter={(value) => {
                            if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
                            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                            return value.toString()
                          }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
