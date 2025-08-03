'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Clock,
  MousePointerClick,
  TrendingUp,
  CalendarPlus,
  CalendarMinus,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Minus,
  LineChart,
  Globe,
  Users,
  Activity
} from "lucide-react"
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

interface TrafficCvInspiredDetailProps {
  domain: DomainData
}

export function TrafficCvInspiredDetail({ domain }: TrafficCvInspiredDetailProps) {
  // 生成访问量趋势数据 - 模拟Traffic.cv的下降趋势
  const visitsData = [
    { month: '2025/04', visits: 580000 },
    { month: '2025/05', visits: 320000 },
    { month: '2025/06', visits: 148420 },
  ]

  // 格式化数字 - 完全按照参考代码的格式
  const formatNumber = (num: number | string | null) => {
    if (!num) return 'N/A'
    const numValue = typeof num === 'string' ? parseInt(num) : num
    if (numValue >= 1000000) return `${(numValue / 1000000).toFixed(1)}M`
    if (numValue >= 1000) return `${(numValue / 1000).toFixed(1)}K`
    return numValue.toString()
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // 获取增长图标
  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <ArrowUp className="w-4 h-4 text-green-600" />
    if (rate < 0) return <ArrowDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  // 获取增长颜色
  const getGrowthColor = (rate: number) => {
    if (rate > 0) return "text-green-600"
    if (rate < 0) return "text-red-600"
    return "text-gray-600"
  }

  // 模拟增长率数据
  const growthRate = -62.59 // 模拟Traffic.cv的下降趋势

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 域名头部卡片 - 参考Traffic.cv的设计 */}
        <Card className="shadow-sm hover:shadow-md transition-shadow mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-primary" />
                  {domain.domain}
                  <a 
                    href={`https://${domain.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 p-1 text-gray-500 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {domain.title || domain.description || "Loading description..."}
                </p>
              </div>
              <Badge variant="secondary" className="ml-4">
                Global Rank #{domain.global_rank || 'N/A'}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* 核心指标卡片网格 - 完全按照参考代码的风格 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* 左侧指标卡片区域 */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 主要指标网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              
              {/* Total Visits */}
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">Total Visits</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatNumber(domain.monthly_visits)}
                </div>
                <div className={`flex items-center justify-center space-x-1 text-sm ${getGrowthColor(growthRate)}`}>
                  {getGrowthIcon(growthRate)}
                  <span>{Math.abs(growthRate)}%</span>
                </div>
              </div>

              {/* Avg. Duration */}
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">Avg. Duration</span>
                </div>
                <div className="text-2xl font-bold text-green-600">00:00:25</div>
                <div className="text-xs text-gray-500">Session Time</div>
              </div>

              {/* Pages per Visit */}
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center justify-center mb-2">
                  <MousePointerClick className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">Pages/Visit</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">2.95</div>
                <div className="text-xs text-gray-500">Page Depth</div>
              </div>

              {/* Bounce Rate */}
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">Bounce Rate</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {domain.bounce_rate || '45.03'}%
                </div>
                <div className="text-xs text-gray-500">Exit Rate</div>
              </div>

              {/* Registration */}
              <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex items-center justify-center mb-2">
                  <CalendarPlus className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">Registration</span>
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {formatDate('2025-04-16')}
                </div>
                <div className="text-xs text-gray-500">Domain Age</div>
              </div>

              {/* Expiration */}
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center justify-center mb-2">
                  <CalendarMinus className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">Expiration</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {formatDate('2026-04-16')}
                </div>
                <div className="text-xs text-gray-500">Renewal Due</div>
              </div>

            </div>
          </div>

          {/* 右侧图表区域 */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-primary" />
                  Visits Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={visitsData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        tickFormatter={(value) => formatNumber(value)}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: number) => [formatNumber(value), 'Visits']}
                      />
                      <Area
                        type="monotone"
                        dataKey="visits"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fill="url(#colorVisits)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 详细信息卡片 */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Domain Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Basic Info</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">Domain:</span> {domain.domain}</div>
                  <div><span className="text-gray-500">TLD:</span> {domain.tld || 'N/A'}</div>
                  <div><span className="text-gray-500">Category:</span> {domain.category || 'N/A'}</div>
                  <div><span className="text-gray-500">Country:</span> {domain.country_code || 'N/A'}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Rankings</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">Global:</span> #{domain.global_rank || 'N/A'}</div>
                  <div><span className="text-gray-500">Category:</span> #{domain.category_rank || 'N/A'}</div>
                  <div><span className="text-gray-500">Monthly Visits:</span> {formatNumber(domain.monthly_visits)}</div>
                  <div><span className="text-gray-500">Bounce Rate:</span> {domain.bounce_rate || 'N/A'}%</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {domain.is_trending && (
                    <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      Trending
                    </Badge>
                  )}
                  {domain.is_adult && (
                    <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                      Adult
                    </Badge>
                  )}
                  {domain.is_movie && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      Movie
                    </Badge>
                  )}
                  {!domain.is_trending && !domain.is_adult && !domain.is_movie && (
                    <Badge variant="outline" className="text-gray-600">
                      Standard
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
