'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { LayoutGrid, TableIcon, TrendingUp, TrendingDown, Calendar, Globe, Search, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface DomainData {
  id: string
  domain: string
  globalRank?: number
  monthlyVisits?: string
  trafficGrowth?: number
  growthRate?: number
  registrationDate?: string
  category?: string
}

interface KeywordAnalysisViewProps {
  keyword: string
  data: {
    domains: DomainData[]
    totalResults: number
    loading?: boolean
  }
}

type ViewMode = 'card' | 'table'
type SortBy = 'searchResults' | 'trafficVolume' | 'trafficGrowth' | 'growthRate' | 'registrationDate'
type SortDirection = 'asc' | 'desc'

export function KeywordAnalysisView({ keyword, data }: KeywordAnalysisViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [sortBy, setSortBy] = useState<SortBy>('searchResults')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchKeyword, setSearchKeyword] = useState(keyword)
  
  // Initialize from URL parameters
  useEffect(() => {
    const view = searchParams.get('view') as ViewMode
    const sort = searchParams.get('sort') as SortBy
    const direction = searchParams.get('direction') as SortDirection
    
    if (view && ['card', 'table'].includes(view)) {
      setViewMode(view)
    }
    if (sort && ['searchResults', 'trafficVolume', 'trafficGrowth', 'growthRate', 'registrationDate'].includes(sort)) {
      setSortBy(sort)
    }
    if (direction && ['asc', 'desc'].includes(direction)) {
      setSortDirection(direction)
    }
  }, [searchParams])
  
  // 格式化数字
  const formatNumber = (num: string | number | undefined) => {
    if (!num) return '-'
    const value = typeof num === 'string' ? parseInt(num) : num
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`
    return value.toLocaleString()
  }

  // 格式化日期
  const formatDate = (date: string | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // 处理搜索
  const handleSearch = () => {
    if (searchKeyword.trim()) {
      router.push(`/dashboard/keywords/${encodeURIComponent(searchKeyword.trim())}`)
    }
  }

  // 处理按键
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  // 更新URL参数
  const updateURLParams = (params: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      current.set(key, value)
    })
    router.push(`${window.location.pathname}?${current.toString()}`)
  }
  
  // 处理排序点击
  const handleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      // 如果点击同一个排序项，切换方向
      const newDirection = sortDirection === 'desc' ? 'asc' : 'desc'
      setSortDirection(newDirection)
      updateURLParams({ sort: newSortBy, direction: newDirection })
    } else {
      // 如果点击新的排序项，默认降序
      setSortBy(newSortBy)
      setSortDirection('desc')
      updateURLParams({ sort: newSortBy, direction: 'desc' })
    }
  }
  
  // 处理视图切换
  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView)
    updateURLParams({ view: newView })
  }
  
  // 对数据进行排序
  const sortedDomains = [...data.domains].sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortBy) {
      case 'searchResults':
        // 默认按搜索相关性排序（这里简单按ID排序）
        aValue = a.id
        bValue = b.id
        break
      case 'trafficVolume':
        aValue = parseInt(a.monthlyVisits || '0')
        bValue = parseInt(b.monthlyVisits || '0')
        break
      case 'trafficGrowth':
        aValue = a.trafficGrowth || 0
        bValue = b.trafficGrowth || 0
        break
      case 'growthRate':
        aValue = a.growthRate || 0
        bValue = b.growthRate || 0
        break
      case 'registrationDate':
        aValue = a.registrationDate ? new Date(a.registrationDate).getTime() : 0
        bValue = b.registrationDate ? new Date(b.registrationDate).getTime() : 0
        break
      default:
        return 0
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return (
    <div>
      {/* 头部导航 */}
      <div className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* 面包屑导航 */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/dashboard/keywords" className="hover:text-gray-900">Keywords</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{keyword}</span>
          </nav>

          {/* 标题 */}
          <h1 className="text-2xl font-semibold text-gray-900">
            Keyword Traffic Analysis for &ldquo;{keyword}&rdquo;
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Showing {data.totalResults} websites ranking for this keyword
          </p>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 搜索栏 */}
        <div className="mb-6">
          <div className="max-w-2xl">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter a keyword to analyze..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12"
              />
              <Button 
                onClick={handleSearch}
                className="h-12 px-6"
              >
                <Search className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">Sort by:</span>
            
            <button
              onClick={() => handleSort('searchResults')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                sortBy === 'searchResults' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">Search Results</span>
              <span className="sm:hidden">Results</span>
              {sortBy === 'searchResults' && (
                sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
              )}
            </button>
            
            <button
              onClick={() => handleSort('trafficVolume')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                sortBy === 'trafficVolume' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">Traffic Volume</span>
              <span className="sm:hidden">Traffic</span>
              {sortBy === 'trafficVolume' && (
                sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
              )}
            </button>
            
            <button
              onClick={() => handleSort('trafficGrowth')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                sortBy === 'trafficGrowth' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">Growth Volume</span>
              <span className="sm:hidden">Growth</span>
              {sortBy === 'trafficGrowth' && (
                sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
              )}
            </button>
            
            <button
              onClick={() => handleSort('growthRate')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                sortBy === 'growthRate' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">Growth Rate</span>
              <span className="sm:hidden">Rate</span>
              {sortBy === 'growthRate' && (
                sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
              )}
            </button>
            
            <button
              onClick={() => handleSort('registrationDate')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                sortBy === 'registrationDate' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">Registration Date</span>
              <span className="sm:hidden">Date</span>
              {sortBy === 'registrationDate' && (
                sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'card' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewChange('card')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewChange('table')}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 数据展示区域 */}
        {data.loading ? (
          <LoadingSkeleton viewMode={viewMode} />
        ) : viewMode === 'card' ? (
          <CardView domains={sortedDomains} formatNumber={formatNumber} formatDate={formatDate} />
        ) : (
          <TableView domains={sortedDomains} formatNumber={formatNumber} formatDate={formatDate} />
        )}
      </div>
    </div>
  )
}

// Card视图组件
function CardView({ 
  domains, 
  formatNumber, 
  formatDate 
}: { 
  domains: DomainData[]
  formatNumber: (num: string | number | undefined) => string
  formatDate: (date: string | undefined) => string
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {domains.map((domain) => (
        <Card key={domain.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    <Link href={`/dashboard/domains/${domain.id}`} className="hover:text-blue-600">
                      {domain.domain}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600">{domain.category || 'Uncategorized'}</p>
                </div>
              </div>
              {domain.globalRank && (
                <span className="text-sm font-medium text-gray-900">
                  #{domain.globalRank.toLocaleString()}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Traffic Volume</span>
                <span className="font-semibold">{formatNumber(domain.monthlyVisits)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Growth</span>
                <div className="flex items-center gap-1">
                  {domain.growthRate && domain.growthRate > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`font-semibold ${
                    domain.growthRate && domain.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {domain.growthRate ? `${Math.abs(domain.growthRate)}%` : '-'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Registered</span>
                <span className="text-sm">{formatDate(domain.registrationDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Table视图组件
function TableView({ 
  domains, 
  formatNumber, 
  formatDate 
}: { 
  domains: DomainData[]
  formatNumber: (num: string | number | undefined) => string
  formatDate: (date: string | undefined) => string
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Domain</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Global Rank</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Traffic Volume</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Growth Rate</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {domains.map((domain) => (
                <tr key={domain.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <Globe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <Link 
                          href={`/dashboard/domains/${domain.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {domain.domain}
                        </Link>
                        <p className="text-sm text-gray-600">{domain.category || 'Uncategorized'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {domain.globalRank ? `#${domain.globalRank.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-4 px-6 text-right font-medium">
                    {formatNumber(domain.monthlyVisits)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {domain.growthRate && domain.growthRate > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : domain.growthRate && domain.growthRate < 0 ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : null}
                      <span className={`font-medium ${
                        domain.growthRate && domain.growthRate > 0 
                          ? 'text-green-600' 
                          : domain.growthRate && domain.growthRate < 0 
                          ? 'text-red-600' 
                          : ''
                      }`}>
                        {domain.growthRate ? `${Math.abs(domain.growthRate)}%` : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-sm">
                    {formatDate(domain.registrationDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// 加载骨架屏组件
function LoadingSkeleton({ viewMode }: { viewMode: ViewMode }) {
  if (viewMode === 'card') {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="bg-gray-50 border-b p-4">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 border-b">
            <div className="flex items-center gap-4">
              <Skeleton className="w-8 h-8 rounded" />
              <div className="flex-1">
                <Skeleton className="h-5 w-48 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}