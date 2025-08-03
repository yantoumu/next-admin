'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DomainTablePaginationProps {
  currentPage: number
  pageSize: number
  total: number
}

export function DomainTablePagination({
  currentPage,
  pageSize,
  total,
}: DomainTablePaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / pageSize)

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const updatePageSize = (size: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('pageSize', size)
    params.set('page', '1') // 重置到第一页
    router.push(`?${params.toString()}`)
  }

  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, total)

  // 生成页码按钮
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxButtons = 7
    const halfButtons = Math.floor(maxButtons / 2)

    if (totalPages <= maxButtons) {
      // 显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 添加第一页
      pages.push(1)

      if (currentPage <= halfButtons + 1) {
        // 当前页靠近开头
        for (let i = 2; i <= maxButtons - 2; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - halfButtons) {
        // 当前页靠近结尾
        pages.push('...')
        for (let i = totalPages - maxButtons + 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 当前页在中间
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="text-sm text-muted-foreground">
          显示 {startIndex}-{endIndex} / {total.toLocaleString()} 条记录
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">每页</span>
          <Select value={pageSize.toString()} onValueChange={updatePageSize}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">条</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updatePage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updatePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <div key={`ellipsis-${index}`} className="px-2 flex items-center">
                  ...
                </div>
              )
            }
            const pageNum = page as number
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="icon"
                onClick={() => updatePage(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => updatePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updatePage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}