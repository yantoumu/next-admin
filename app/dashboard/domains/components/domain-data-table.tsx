import { DomainInfo } from '@prisma/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Link from 'next/link'

interface DomainDataTableProps {
  domains: DomainInfo[]
}

export function DomainDataTable({ domains }: DomainDataTableProps) {
  const formatNumber = (num: bigint | number | null): string => {
    if (!num) return '-'
    const n = typeof num === 'bigint' ? Number(num) : num
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(1)}M`
    } else if (n >= 1000) {
      return `${(n / 1000).toFixed(1)}K`
    }
    return n.toString()
  }

  const formatDate = (date: Date | null): string => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('zh-CN')
  }

  const formatDecimal = (num: any): string => {
    if (!num) return '-'
    return parseFloat(num).toFixed(2)
  }

  const getTrendIcon = (trend: number | null) => {
    if (!trend) return <Minus className="h-3 w-3 text-muted-foreground" />
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-green-500" />
    return <TrendingDown className="h-3 w-3 text-red-500" />
  }

  // 模拟流量趋势（实际应该从数据库获取）
  const getTrafficTrend = () => {
    const trends = [5, -2, 0, 12, -8, 3, 0, 15, -5, 8]
    return trends[Math.floor(Math.random() * trends.length)]
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input type="checkbox" className="rounded border-gray-300" />
            </TableHead>
            <TableHead>域名</TableHead>
            <TableHead className="text-right">月流量</TableHead>
            <TableHead>注册日期</TableHead>
            <TableHead>分类</TableHead>
            <TableHead>地区</TableHead>
            <TableHead className="text-center">标签</TableHead>
            <TableHead className="w-20">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            domains.map((domain) => {
              const trend = getTrafficTrend()
              return (
                <TableRow key={domain.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{domain.domain}</div>
                      {domain.global_rank && (
                        <div className="text-xs text-muted-foreground">
                          全球排名 #{domain.global_rank.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-medium">
                        {formatNumber(domain.monthly_visits)}
                      </span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(trend)}
                        {trend !== 0 && (
                          <span className={cn(
                            "text-xs",
                            trend > 0 ? "text-green-500" : "text-red-500"
                          )}>
                            {Math.abs(trend)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(domain.registration_date)}</TableCell>
                  <TableCell>
                    {domain.category ? (
                      <Badge variant="secondary" className="text-xs">
                        {domain.category}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {domain.country_code ? (
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{domain.country_code}</span>
                        {domain.country_rank && (
                          <span className="text-xs text-muted-foreground">
                            #{domain.country_rank}
                          </span>
                        )}
                      </div>
                    ) : (
                      'Global'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      {domain.is_trending && (
                        <Badge variant="default" className="text-xs">
                          🔥 热门
                        </Badge>
                      )}
                      {domain.is_adult && (
                        <Badge variant="destructive" className="text-xs">
                          18+
                        </Badge>
                      )}
                      {domain.is_movie && (
                        <Badge variant="outline" className="text-xs">
                          🎬 影视
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/domains/${domain.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}