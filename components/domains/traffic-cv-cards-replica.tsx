'use client'

import { 
  ChartBarBig, 
  Clock, 
  MousePointerClick, 
  TrendingUp, 
  CalendarPlus, 
  CalendarMinus,
  ChartSpline
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
}

interface TrafficCvCardsReplicaProps {
  domain: DomainData
}

export function TrafficCvCardsReplica({ domain }: TrafficCvCardsReplicaProps) {
  // 生成访问量趋势数据 - 模拟Traffic.cv的下降趋势
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
      {/* Traffic.cv 主容器 - 精确复刻 */}
      <div className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-md mb-4 bg-white p-4 md:p-6 pt-4 space-y-4 md:space-y-6">
        
        {/* 指标网格 - 完全按照Traffic.cv的布局 */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* 左侧指标卡片区域 - lg:col-span-3 */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
              
              {/* Total Visits - 精确复刻 */}
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
                        <ChartBarBig className="h-4 w-4 text-primary" aria-hidden="true" />
                        Total Visits
                      </p>
                      <div className="font-semibold mt-2 text-base md:text-xl">
                        {formatVisits(domain.monthly_visits)}
                        <span className="ml-1.5 text-sm text-red-500">-62.59%</span>
                      </div>
                    </div>
                    <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                      <ChartBarBig className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Avg. Duration - 精确复刻 */}
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
                        <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                        Avg. Duration
                      </p>
                      <div className="font-semibold mt-2 text-base md:text-xl">00:00:25</div>
                    </div>
                    <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pages per Visit - 精确复刻 */}
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
                        <MousePointerClick className="h-4 w-4 text-primary" aria-hidden="true" />
                        Pages per Visit
                      </p>
                      <div className="font-semibold mt-2 text-base md:text-xl">2.95</div>
                    </div>
                    <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                      <MousePointerClick className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bounce Rate - 精确复刻 */}
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
                        <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
                        Bounce Rate
                      </p>
                      <div className="font-semibold mt-2 text-base md:text-xl">
                        {domain.bounce_rate || '45.03'}%
                      </div>
                    </div>
                    <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration - 精确复刻 */}
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
                        <CalendarPlus className="h-4 w-4 text-primary" aria-hidden="true" />
                        Registration
                      </p>
                      <div className="font-semibold mt-2 text-base md:text-xl">2025-4-16</div>
                    </div>
                    <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                      <CalendarPlus className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expiration - 精确复刻 */}
              <div className="rounded-md bg-slate-50 p-3 md:p-4">
                <div className="">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
                        <CalendarMinus className="h-4 w-4 text-primary" aria-hidden="true" />
                        Expiration
                      </p>
                      <div className="font-semibold mt-2 text-base md:text-xl">2026-4-16</div>
                    </div>
                    <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                      <CalendarMinus className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 右侧图表区域 - lg:col-span-2 */}
            <div className="lg:col-span-2">
              <div className="">
                <div className="flex items-center gap-2 mb-4">
                  <ChartSpline className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium">Visits Over Time</span>
                </div>
                <div className="w-full">
                  {/* 完全复刻Recharts配置和样式 */}
                  <div 
                    data-slot="chart" 
                    data-chart="chart-replica" 
                    className="[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden max-h-[172px] w-full"
                  >
                    <div className="recharts-responsive-container" style={{ width: '100%', height: '100%', minWidth: '0px' }}>
                      <ResponsiveContainer width="100%" height={172}>
                        <AreaChart 
                          data={visitsData} 
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
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
                            tickFormatter={(value) => {
                              if (value >= 1000000) return `${Math.floor(value / 1000000)}M`
                              if (value >= 1000) return `${Math.floor(value / 1000)}K`
                              return value.toString()
                            }}
                            width={60}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}
                            formatter={(value: number) => [
                              value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : 
                              value >= 1000 ? `${Math.floor(value / 1000)}K` : value.toString(),
                              'Visits'
                            ]}
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
    </div>
  )
}
