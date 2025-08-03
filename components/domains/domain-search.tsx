'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'

interface DomainSearchProps {
  placeholder?: string
  defaultValue?: string
  loading?: boolean
  autoFocus?: boolean
  minSearchLength?: number
  onSearch?: (query: string) => void  // 向后兼容
}

export function DomainSearch({
  placeholder = '搜索域名...',
  defaultValue = '',
  loading = false,
  autoFocus = false,
  minSearchLength = 2,
  onSearch
}: DomainSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // 使用防抖优化搜索性能
  const debouncedQuery = useDebounce(query, 300)

  // 更新URL参数的函数
  const updateSearchURL = useCallback((searchQuery: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // 清除页码，因为搜索后需要回到第一页
    params.delete('page')

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    } else {
      params.delete('search')
    }

    // 导航到新URL
    router.push(`/dashboard/domains?${params.toString()}`)
  }, [router, searchParams])

  // 处理搜索
  useEffect(() => {
    if (debouncedQuery.length >= minSearchLength || debouncedQuery.length === 0) {
      if (onSearch) {
        // 如果提供了 onSearch 回调，使用它
        onSearch(debouncedQuery)
      } else {
        // 否则使用默认的 URL 更新行为
        updateSearchURL(debouncedQuery)
      }
    }
  }, [debouncedQuery, updateSearchURL, minSearchLength, onSearch])

  // 处理输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  // 清空搜索
  const handleClear = useCallback(() => {
    setQuery('')
    if (onSearch) {
      onSearch('')
    } else {
      updateSearchURL('')
    }
    inputRef.current?.focus()
  }, [updateSearchURL, onSearch])

  // 处理回车键搜索
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.length >= minSearchLength) {
      e.preventDefault()
      if (onSearch) {
        onSearch(query)
      } else {
        updateSearchURL(query)
      }
    }
  }, [query, minSearchLength, updateSearchURL, onSearch])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="pl-9 pr-20 h-12 text-base border-gray-200 focus:border-gray-300 focus:ring-0"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 w-7 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {loading && (
            <div className="pr-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
      {query.length > 0 && query.length < minSearchLength && (
        <p className="text-xs text-muted-foreground mt-1">
          请输入至少 {minSearchLength} 个字符进行搜索
        </p>
      )}
    </div>
  )
}