'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Calendar, Globe, Server, Activity } from 'lucide-react'

interface DomainInfoCardProps {
  domain: {
    domain: string
    tld?: string | null
    registrar?: string | null
    registration_date?: Date | string | null
    expiration_date?: Date | string | null
    nameservers?: string[]
    global_rank?: number | null
    monthly_visits?: bigint | string | null
    bounce_rate?: number | string | null
    pages_per_visit?: number | string | null
    avg_visit_duration?: number | null
    category?: string | null
    is_adult?: boolean
    is_movie?: boolean
    is_trending?: boolean
    country_code?: string | null
    country_rank?: number | null
    last_updated?: Date | string | null
  }
}

export function DomainInfoCard({ domain }: DomainInfoCardProps) {
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '-'
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('zh-CN')
  }

  const formatDateDistance = (date: Date | string | null | undefined) => {
    if (!date) return null
    const d = typeof date === 'string' ? new Date(date) : date
    return formatDistanceToNow(d, { locale: zhCN, addSuffix: true })
  }

  const formatNumber = (num: bigint | string | number | null | undefined) => {
    if (!num) return '-'
    const n = typeof num === 'string' ? parseInt(num) : Number(num)
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(1)}M`
    } else if (n >= 1000) {
      return `${(n / 1000).toFixed(1)}K`
    }
    return n.toString()
  }

  const formatDecimal = (num: number | string | null | undefined) => {
    if (!num) return '-'
    const n = typeof num === 'string' ? parseFloat(num) : num
    return n.toFixed(2)
  }

  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds) return '-'
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}分${secs}秒`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            基本信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">域名</p>
            <p className="font-medium">{domain.domain}</p>
          </div>
          {domain.tld && (
            <div>
              <p className="text-sm text-muted-foreground">顶级域名</p>
              <p className="font-medium">.{domain.tld}</p>
            </div>
          )}
          {domain.registrar && (
            <div>
              <p className="text-sm text-muted-foreground">注册商</p>
              <p className="font-medium">{domain.registrar}</p>
            </div>
          )}
          {domain.category && (
            <div>
              <p className="text-sm text-muted-foreground">分类</p>
              <p className="font-medium">{domain.category}</p>
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            {domain.is_trending && <Badge variant="default">热门</Badge>}
            {domain.is_adult && <Badge variant="destructive">成人内容</Badge>}
            {domain.is_movie && <Badge variant="secondary">影视</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* 注册信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            注册信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">注册日期</p>
            <p className="font-medium">{formatDate(domain.registration_date)}</p>
            {domain.registration_date && (
              <p className="text-xs text-muted-foreground">
                {formatDateDistance(domain.registration_date)}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">到期日期</p>
            <p className="font-medium">{formatDate(domain.expiration_date)}</p>
            {domain.expiration_date && (
              <p className="text-xs text-muted-foreground">
                {formatDateDistance(domain.expiration_date)}
              </p>
            )}
          </div>
          {domain.nameservers && domain.nameservers.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">域名服务器</p>
              <div className="space-y-1">
                {domain.nameservers.map((ns, index) => (
                  <p key={index} className="text-sm font-medium">
                    {ns}
                  </p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 流量数据 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            流量数据
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-muted-foreground">全球排名</p>
              <p className="font-medium">
                {domain.global_rank ? `#${domain.global_rank.toLocaleString()}` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">月访问量</p>
              <p className="font-medium">{formatNumber(domain.monthly_visits)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">跳出率</p>
              <p className="font-medium">
                {domain.bounce_rate ? `${formatDecimal(domain.bounce_rate)}%` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">页面/访问</p>
              <p className="font-medium">{formatDecimal(domain.pages_per_visit)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">平均访问时长</p>
            <p className="font-medium">{formatDuration(domain.avg_visit_duration)}</p>
          </div>
          {domain.country_code && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">国家/地区</p>
                <p className="font-medium">{domain.country_code.toUpperCase()}</p>
              </div>
              {domain.country_rank && (
                <div>
                  <p className="text-sm text-muted-foreground">国家排名</p>
                  <p className="font-medium">#{domain.country_rank.toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}