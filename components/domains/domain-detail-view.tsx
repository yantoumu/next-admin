'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, TrendingUp, Users, Clock, Calendar, MapPin, Search, Eye, BarChart3, PieChart, Table } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LineChart, Line, PieChart as RechartsChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface DomainData {
  id: string
  domain: string
  tld?: string | null
  global_rank?: number | null
  monthly_visits?: string | null
  bounce_rate?: number | null
  pages_per_visit?: number | null
  avg_visit_duration?: number | null
  category?: string | null
  category_name?: string | null
  registration_date?: string | null
  expiration_date?: string | null
  updated_date?: string | null
  registrar?: string | null
  title?: string | null
  description?: string | null
  traffic_direct?: number | null
  traffic_search?: number | null
  traffic_social?: number | null
  traffic_referral?: number | null
  traffic_paid?: number | null
  traffic_mail?: number | null
  country_code?: string | null
  country_rank?: number | null
  is_adult?: boolean
  is_movie?: boolean
  is_trending?: boolean
  top_countries?: any
  top_keywords?: any
  monthly_trend?: any
  nameservers?: string[]
  domain_status?: string[]
}

interface DomainDetailViewProps {
  domain: DomainData
}

export function DomainDetailView({ domain }: DomainDetailViewProps) {
  const router = useRouter()
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('3M')

  // 格式化数字
  const formatNumber = (num: string | number | null | undefined) => {
    if (!num) return '-'
    const value = typeof num === 'string' ? parseInt(num) : num
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`
    return value.toLocaleString()
  }

  // 格式化时间
  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds) return '0m 0s'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // 准备流量来源数据
  const trafficSourceData = [
    { name: '直接访问', value: domain.traffic_direct || 0, color: '#3B82F6' },
    { name: '搜索引擎', value: domain.traffic_search || 0, color: '#10B981' },
    { name: '社交媒体', value: domain.traffic_social || 0, color: '#8B5CF6' },
    { name: '外链', value: domain.traffic_referral || 0, color: '#F59E0B' },
    { name: '付费广告', value: domain.traffic_paid || 0, color: '#EF4444' },
    { name: '邮件', value: domain.traffic_mail || 0, color: '#EC4899' }
  ].filter(item => item.value > 0)

  // 模拟月度趋势数据
  const trendData = [
    { month: '1月', visits: 850000 },
    { month: '2月', visits: 920000 },
    { month: '3月', visits: 1100000 },
    { month: '4月', visits: 1050000 },
    { month: '5月', visits: 1200000 },
    { month: '6月', visits: 1350000 }
  ]

  // 模拟地区数据
  const regionData = domain.top_countries || [
    { code: 'US', name: '美国', percentage: 35.2 },
    { code: 'CN', name: '中国', percentage: 28.5 },
    { code: 'UK', name: '英国', percentage: 12.3 },
    { code: 'JP', name: '日本', percentage: 8.7 },
    { code: 'DE', name: '德国', percentage: 5.3 }
  ]

  // 模拟关键词数据
  const keywordData = domain.top_keywords || [
    { keyword: 'domain analysis', traffic: 25000, volume: 120000, cpc: '$2.50' },
    { keyword: 'website traffic', traffic: 18000, volume: 90000, cpc: '$3.20' },
    { keyword: 'site checker', traffic: 15000, volume: 75000, cpc: '$1.80' },
    { keyword: 'domain info', traffic: 12000, volume: 60000, cpc: '$2.10' },
    { keyword: 'traffic stats', traffic: 8000, volume: 40000, cpc: '$2.80' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* 头部域名信息和核心指标 */}
      <div className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* 域名标题区域 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{domain.domain}</h1>
              {domain.title && (
                <p className="text-sm text-gray-600">{domain.title}</p>
              )}
            </div>
          </div>

          {/* 核心指标横向排列 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600">全球排名</p>
              <p className="text-2xl font-semibold text-gray-900">
                {domain.global_rank ? `#${domain.global_rank.toLocaleString()}` : '-'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600">国家排名</p>
              <p className="text-2xl font-semibold text-gray-900">
                {domain.country_rank ? `#${domain.country_rank.toLocaleString()}` : '-'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600">月访问量</p>
              <p className="text-2xl font-semibold text-gray-900">{formatNumber(domain.monthly_visits)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600">跳出率</p>
              <p className="text-2xl font-semibold text-gray-900">
                {domain.bounce_rate ? `${domain.bounce_rate}%` : '-'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600">平均访问时长</p>
              <p className="text-2xl font-semibold text-gray-900">{formatDuration(domain.avg_visit_duration)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600">页面/访问</p>
              <p className="text-2xl font-semibold text-gray-900">
                {domain.pages_per_visit ? domain.pages_per_visit.toFixed(2) : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 左侧：流量趋势和流量概览 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 流量趋势图表 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    流量趋势
                  </CardTitle>
                  <div className="flex gap-2">
                    {(['1M', '3M', '6M', '1Y'] as const).map((range) => (
                      <Button
                        key={range}
                        variant={selectedTimeRange === range ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTimeRange(range)}
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatNumber(value)} />
                    <Area 
                      type="monotone" 
                      dataKey="visits" 
                      stroke="#3B82F6" 
                      fillOpacity={1} 
                      fill="url(#colorVisits)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 流量概览 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  流量概览
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">总访问量</p>
                      <p className="text-3xl font-semibold">{formatNumber(domain.monthly_visits)}</p>
                      <p className="text-sm text-green-600">↑ 12.5% vs 上月</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">平均停留时间</p>
                      <p className="text-2xl font-semibold">{formatDuration(domain.avg_visit_duration)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">页面访问数</p>
                      <p className="text-3xl font-semibold">
                        {domain.pages_per_visit ? domain.pages_per_visit.toFixed(2) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">跳出率</p>
                      <p className="text-2xl font-semibold">
                        {domain.bounce_rate ? `${domain.bounce_rate}%` : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 关键词分析 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Top Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-sm font-medium text-gray-600">关键词</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-600">流量</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-600">搜索量</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-600">CPC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywordData.map((keyword: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 text-sm">{keyword.keyword}</td>
                          <td className="py-3 text-sm text-right">{formatNumber(keyword.traffic)}</td>
                          <td className="py-3 text-sm text-right">{formatNumber(keyword.volume)}</td>
                          <td className="py-3 text-sm text-right">{keyword.cpc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：流量来源和地理分布 */}
          <div className="space-y-6">
            {/* 流量来源饼图 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  流量来源
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsChart>
                    <Pie
                      data={trafficSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trafficSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {trafficSourceData.map((source, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: source.color }} />
                        <span>{source.name}</span>
                      </div>
                      <span className="font-medium">{source.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 地理分布 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Top Regions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regionData.map((region: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCountryFlag(region.code)}</span>
                        <span className="text-sm font-medium">{region.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${region.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{region.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 域名信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  域名信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">分类</span>
                  <span className="font-medium">{domain.category_name || domain.category || '未分类'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">注册日期</span>
                  <span className="font-medium">
                    {domain.registration_date ? new Date(domain.registration_date).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">到期日期</span>
                  <span className="font-medium">
                    {domain.expiration_date ? new Date(domain.expiration_date).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">注册商</span>
                  <span className="font-medium">{domain.registrar || '-'}</span>
                </div>
                {domain.nameservers && domain.nameservers.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 mb-2">名称服务器</p>
                    {domain.nameservers.map((ns, index) => (
                      <p key={index} className="text-xs font-mono text-gray-700">{ns}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// 获取国家旗帜表情
function getCountryFlag(countryCode: string): string {
  const flags: { [key: string]: string } = {
    'US': '🇺🇸',
    'CN': '🇨🇳',
    'UK': '🇬🇧',
    'JP': '🇯🇵',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'IN': '🇮🇳',
    'BR': '🇧🇷',
    'CA': '🇨🇦',
    'AU': '🇦🇺'
  }
  return flags[countryCode] || '🌐'
}