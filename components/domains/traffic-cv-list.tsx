'use client'

import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  BarChart3,
  TrendingUp,
  Calendar,
  LayoutGrid,
  List,
  Activity,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { DomainData } from '@/types/domain'

interface TrafficCvListProps {
  domains: DomainData[]
  totalCount: number
  currentPage: number
  pageSize: number
}

export function TrafficCvList({ domains, totalCount, currentPage, pageSize }: TrafficCvListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'search-results')

  const sortOptions = [
    { id: 'search-results', label: '搜索结果', icon: Search },
    { id: 'traffic-volume', label: '流量大小', icon: BarChart3 },
    { id: 'growth-volume', label: '增长量', icon: TrendingUp },
    { id: 'growth-rate', label: '增长率', icon: Activity },
    { id: 'registration-date', label: '注册日期', icon: Calendar },
  ]

  // 处理排序
  const handleSort = useCallback((sortType: string) => {
    setSortBy(sortType)
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortType)
    params.set('page', '1') // 排序时重置到第一页
    router.push(`?${params.toString()}`)
  }, [router, searchParams])

  // 格式化数字
  const formatNumber = (num: string | number | null | undefined) => {
    if (!num) return '0'
    const value = typeof num === 'string' ? parseInt(num) : num
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toLocaleString()
  }

  // 格式化日期
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '-'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // 获取增长率（使用真实数据或模拟）
  const getGrowthRate = (domain: DomainData) => {
    // 如果有真实的增长率数据，使用它
    if (typeof domain.growthRate === 'number') {
      return domain.growthRate
    }
    // 否则返回 0
    return 0
  }

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <ArrowUp className="w-4 h-4 text-green-600" />
    if (rate < 0) return <ArrowDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return 'text-green-600'
    if (rate < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  // 处理分页
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* 控制栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-gray-700">排序方式</span>
          <div className="flex items-center space-x-4">
            {sortOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => handleSort(option.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    sortBy === option.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{option.label}</span>
                  <span className="sm:hidden">{option.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 视图切换 */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('card')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      {viewMode === 'card' ? (
        <div className="space-y-6">
          {domains.map((domain, index) => {
            const growthRate = getGrowthRate(domain)
            const keywords = domain.topKeywords || []
            
            return (
              <Card key={domain.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {domain.title || domain.domain}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link 
                          href={`/dashboard/domains/${domain.id}`}
                          className="hover:text-blue-600 flex items-center gap-1"
                        >
                          <span>{domain.domain}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      Rank #{domain.globalRank || (index + 1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {domain.description || 'No description available'}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatNumber(domain.monthlyVisits)}
                      </div>
                      <div className="text-xs text-gray-600">Traffic Volume</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className={`text-2xl font-bold flex items-center justify-center space-x-1 ${getGrowthColor(growthRate)}`}>
                        {getGrowthIcon(growthRate)}
                        <span>{Math.abs(growthRate)}%</span>
                      </div>
                      <div className="text-xs text-gray-600">Growth Rate</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {domain.bounceRate ? `${domain.bounceRate}%` : '-'}
                      </div>
                      <div className="text-xs text-gray-600">Bounce Rate</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">
                        {formatDate(domain.registrationDate)}
                      </div>
                      <div className="text-xs text-gray-600">Registered</div>
                    </div>
                  </div>

                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {keywords.slice(0, 5).map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {keyword.keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Traffic Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Growth Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bounce Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {domains.map((domain) => {
                    const growthRate = getGrowthRate(domain)
                    return (
                      <tr key={domain.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <Link 
                              href={`/dashboard/domains/${domain.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600"
                            >
                              {domain.title || domain.domain}
                            </Link>
                            <div className="text-sm text-gray-500">{domain.domain}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(domain.monthlyVisits)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center space-x-1 text-sm ${getGrowthColor(growthRate)}`}>
                            {getGrowthIcon(growthRate)}
                            <span>{Math.abs(growthRate)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {domain.bounceRate ? `${domain.bounceRate}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(domain.registrationDate)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 分页 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of{' '}
          {totalCount} results
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * pageSize >= totalCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}