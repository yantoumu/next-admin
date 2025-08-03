'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback, useTransition, useMemo } from 'react'
import { Search, Filter, Calendar, Globe, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { debounce } from 'lodash'

const CATEGORIES = [
  { value: 'all', label: '全部分类' },
  { value: 'technology', label: '科技' },
  { value: 'entertainment', label: '娱乐' },
  { value: 'news', label: '新闻' },
  { value: 'business', label: '商业' },
  { value: 'education', label: '教育' },
  { value: 'health', label: '健康' },
  { value: 'sports', label: '体育' },
  { value: 'travel', label: '旅游' },
]

const COUNTRIES = [
  { value: 'all', label: '全球' },
  { value: 'CN', label: '中国' },
  { value: 'US', label: '美国' },
  { value: 'UK', label: '英国' },
  { value: 'JP', label: '日本' },
  { value: 'KR', label: '韩国' },
  { value: 'DE', label: '德国' },
  { value: 'FR', label: '法国' },
]

const QUICK_FILTERS: Array<{ label: string; params: Record<string, string> }> = [
  { label: '今日新增', params: { registrationFrom: 'today' } },
  { label: '高流量', params: { minTraffic: '1000000' } },
  { label: '趋势域名', params: { trending: 'true' } },
]

export function DomainSearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // 防抖搜索
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('search', value)
      } else {
        params.delete('search')
      }
      params.set('page', '1') // 重置到第一页
      startTransition(() => {
        router.push(`?${params.toString()}`)
      })
    }, 500),
    [searchParams, router, startTransition]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    debouncedSearch(value)
  }

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const applyQuickFilter = (filterParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(filterParams).forEach(([key, value]) => {
      params.set(key, value)
    })
    params.set('page', '1')
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    startTransition(() => {
      router.push('/dashboard/domains')
    })
  }

  const activeFiltersCount = Array.from(searchParams.entries()).filter(
    ([key]) => !['page', 'pageSize', 'sortField', 'sortOrder'].includes(key)
  ).length

  return (
    <div className="space-y-4">
      {/* 搜索栏和快速筛选 */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索域名或关键词..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10"
              disabled={isPending}
            />
          </div>
        </div>
        <div className="flex gap-2">
          {QUICK_FILTERS.map((filter) => (
            <Button
              key={filter.label}
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter(filter.params)}
              disabled={isPending}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 高级筛选 */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          高级筛选
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={isPending}
          >
            清除筛选
          </Button>
        )}
      </div>

      {/* 高级筛选面板 */}
      {showAdvanced && (
        <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* 注册时间 */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                注册时间
              </Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="开始日期"
                  value={searchParams.get('registrationFrom') || ''}
                  onChange={(e) => updateFilter('registrationFrom', e.target.value)}
                  disabled={isPending}
                />
                <Input
                  type="date"
                  placeholder="结束日期"
                  value={searchParams.get('registrationTo') || ''}
                  onChange={(e) => updateFilter('registrationTo', e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>

            {/* 流量范围 */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1">
                <Globe className="h-3 w-3" />
                月流量范围
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="最小"
                  value={searchParams.get('minTraffic') || ''}
                  onChange={(e) => updateFilter('minTraffic', e.target.value)}
                  disabled={isPending}
                />
                <Input
                  type="number"
                  placeholder="最大"
                  value={searchParams.get('maxTraffic') || ''}
                  onChange={(e) => updateFilter('maxTraffic', e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>

            {/* 分类 */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1">
                <Tag className="h-3 w-3" />
                分类
              </Label>
              <Select
                value={searchParams.get('category') || 'all'}
                onValueChange={(value) => updateFilter('category', value)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 地区 */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1">
                <Globe className="h-3 w-3" />
                地区
              </Label>
              <Select
                value={searchParams.get('countryCode') || 'all'}
                onValueChange={(value) => updateFilter('countryCode', value)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 排序选项 */}
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-sm">排序字段</Label>
              <Select
                value={searchParams.get('sortField') || 'monthlyVisits'}
                onValueChange={(value) => updateFilter('sortField', value)}
                disabled={isPending}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthlyVisits">月流量</SelectItem>
                  <SelectItem value="globalRank">全球排名</SelectItem>
                  <SelectItem value="createdAt">注册时间</SelectItem>
                  <SelectItem value="domain">域名</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">排序方式</Label>
              <Select
                value={searchParams.get('sortOrder') || 'desc'}
                onValueChange={(value) => updateFilter('sortOrder', value)}
                disabled={isPending}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">降序</SelectItem>
                  <SelectItem value="asc">升序</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}