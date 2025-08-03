'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'

interface DomainSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  defaultValue?: string
  loading?: boolean
  autoFocus?: boolean
  minSearchLength?: number
}

export function DomainSearch({
  onSearch,
  placeholder = '搜索域名...',
  defaultValue = '',
  loading = false,
  autoFocus = false,
  minSearchLength = 2
}: DomainSearchProps) {
  const [query, setQuery] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // 使用防抖优化搜索性能
  const debouncedQuery = useDebounce(query, 300)

  // 处理搜索
  useEffect(() => {
    if (debouncedQuery.length >= minSearchLength || debouncedQuery.length === 0) {
      onSearch(debouncedQuery)
    }
  }, [debouncedQuery, onSearch, minSearchLength])

  // 处理输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  // 清空搜索
  const handleClear = useCallback(() => {
    setQuery('')
    onSearch('')
    inputRef.current?.focus()
  }, [onSearch])

  // 处理回车键搜索
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.length >= minSearchLength) {
      e.preventDefault()
      onSearch(query)
    }
  }, [query, minSearchLength, onSearch])

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
          className="pl-9 pr-20"
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