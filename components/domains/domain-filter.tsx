'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

export interface DomainFilterValues {
  categories: string[]
  isAdult: boolean | null
  isMovie: boolean | null
  isTrending: boolean | null
  tld: string | null
  rankRange: 'top100' | 'top1k' | 'top10k' | 'all'
}

interface DomainFilterProps {
  onFilterChange: (filters: DomainFilterValues) => void
  availableCategories?: string[]
  availableTlds?: string[]
  initialFilters?: Partial<DomainFilterValues>
}

const defaultFilters: DomainFilterValues = {
  categories: [],
  isAdult: null,
  isMovie: null,
  isTrending: null,
  tld: null,
  rankRange: 'all'
}

export function DomainFilter({
  onFilterChange,
  availableCategories = [],
  availableTlds = [],
  initialFilters = {}
}: DomainFilterProps) {
  const [filters, setFilters] = useState<DomainFilterValues>({
    ...defaultFilters,
    ...initialFilters
  })

  // 计算活跃筛选项数量
  const calculateActiveFilters = useCallback((f: DomainFilterValues) => {
    let count = 0
    if (f.categories.length > 0) count += f.categories.length
    if (f.isAdult !== null) count++
    if (f.isMovie !== null) count++
    if (f.isTrending !== null) count++
    if (f.tld !== null) count++
    if (f.rankRange !== 'all') count++
    return count
  }, [])

  // 计算活跃筛选项数量
  const activeFiltersCount = calculateActiveFilters(filters)

  // 更新筛选条件
  const updateFilters = useCallback((updates: Partial<DomainFilterValues>) => {
    const newFilters = { ...filters, ...updates }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }, [filters, onFilterChange])

  // 切换分类
  const toggleCategory = useCallback((category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    updateFilters({ categories: newCategories })
  }, [filters.categories, updateFilters])

  // 重置所有筛选
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }, [onFilterChange])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>筛选条件</CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{activeFiltersCount} 个筛选</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-7 px-2"
              >
                <X className="h-3 w-3 mr-1" />
                清除
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 分类筛选 */}
        {availableCategories.length > 0 && (
          <div>
            <Label className="mb-2 block">分类</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label
                    htmlFor={`cat-${category}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 特殊标记 */}
        <div>
          <Label className="mb-2 block">特殊标记</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-trending"
                checked={filters.isTrending === true}
                onCheckedChange={(checked: boolean) => 
                  updateFilters({ isTrending: checked ? true : null })
                }
              />
              <label htmlFor="is-trending" className="text-sm cursor-pointer">
                热门域名
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-adult"
                checked={filters.isAdult === true}
                onCheckedChange={(checked: boolean) => 
                  updateFilters({ isAdult: checked ? true : null })
                }
              />
              <label htmlFor="is-adult" className="text-sm cursor-pointer">
                成人内容
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-movie"
                checked={filters.isMovie === true}
                onCheckedChange={(checked: boolean) => 
                  updateFilters({ isMovie: checked ? true : null })
                }
              />
              <label htmlFor="is-movie" className="text-sm cursor-pointer">
                影视网站
              </label>
            </div>
          </div>
        </div>

        {/* TLD筛选 */}
        {availableTlds.length > 0 && (
          <div>
            <Label htmlFor="tld-filter">顶级域名</Label>
            <Select
              value={filters.tld || 'all'}
              onValueChange={(value) => 
                updateFilters({ tld: value === 'all' ? null : value })
              }
            >
              <SelectTrigger id="tld-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {availableTlds.map(tld => (
                  <SelectItem key={tld} value={tld}>
                    .{tld}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 排名范围 */}
        <div>
          <Label htmlFor="rank-filter">排名范围</Label>
          <Select
            value={filters.rankRange}
            onValueChange={(value) => 
              updateFilters({ rankRange: value as DomainFilterValues['rankRange'] })
            }
          >
            <SelectTrigger id="rank-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部排名</SelectItem>
              <SelectItem value="top100">前 100</SelectItem>
              <SelectItem value="top1k">前 1,000</SelectItem>
              <SelectItem value="top10k">前 10,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}