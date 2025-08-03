'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Globe, 
  TrendingUp, 
  Users, 
  ExternalLink,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react'

interface DomainData {
  id: string
  domain: string
  tld?: string | null
  globalRank?: number | null
  monthlyVisits?: bigint | null
  bounceRate?: number | null
  category?: string | null
  isAdult?: boolean
  isMovie?: boolean
  isTrending?: boolean
  countryCode?: string | null
}

interface DomainListProps {
  domains: DomainData[]
  loading?: boolean
  totalCount?: number
  currentPage?: number
  pageSize?: number
  onPageChange?: (page: number) => void
}

export function DomainList({
  domains,
  loading = false,
  totalCount = 0,
  currentPage = 1,
  pageSize = 20,
  onPageChange
}: DomainListProps) {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null)

  const totalPages = Math.ceil(totalCount / pageSize)
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalCount)

  // 格式化访问量
  const formatVisits = (visits: bigint | null | undefined) => {
    if (!visits) return '-'
    const num = Number(visits)
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  // 格式化排名
  const formatRank = (rank: number | null | undefined) => {
    if (!rank) return '-'
    return `#${rank.toLocaleString()}`
  }

  // 获取排名趋势图标
  const getRankTrend = (isTrending: boolean | undefined) => {
    if (isTrending) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>域名列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>域名列表</CardTitle>
          {totalCount > 0 && (
            <span className="text-sm text-muted-foreground">
              显示 {startIndex}-{endIndex} / 共 {totalCount} 个域名
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>域名</TableHead>
                <TableHead>全球排名</TableHead>
                <TableHead>月访问量</TableHead>
                <TableHead>跳出率</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>标记</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    暂无域名数据
                  </TableCell>
                </TableRow>
              ) : (
                domains.map((domain) => (
                  <TableRow 
                    key={domain.id}
                    onMouseEnter={() => setHoveredDomain(domain.id)}
                    onMouseLeave={() => setHoveredDomain(null)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{domain.domain}</div>
                          {domain.tld && (
                            <span className="text-xs text-muted-foreground">.{domain.tld}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {formatRank(domain.globalRank)}
                        {getRankTrend(domain.isTrending)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {formatVisits(domain.monthlyVisits)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {domain.bounceRate ? `${domain.bounceRate}%` : '-'}
                    </TableCell>
                    <TableCell>
                      {domain.category ? (
                        <Badge variant="secondary" className="text-xs">
                          {domain.category}
                        </Badge>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {domain.isTrending && (
                          <Badge variant="default" className="text-xs">热门</Badge>
                        )}
                        {domain.isAdult && (
                          <Badge variant="destructive" className="text-xs">成人</Badge>
                        )}
                        {domain.isMovie && (
                          <Badge variant="outline" className="text-xs">影视</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/domains/${domain.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`transition-opacity ${
                            hoveredDomain === domain.id ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          查看详情
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 分页控件 */}
        {totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              上一页
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1
                if (totalPages > 5) {
                  if (currentPage > 3 && currentPage < totalPages - 2) {
                    pageNum = currentPage - 2 + i
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  }
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              下一页
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}