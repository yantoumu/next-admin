'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Globe, TrendingUp, AlertTriangle, Film } from 'lucide-react'

interface DomainStatsCardProps {
  title: string
  value: number | string
  icon: 'globe' | 'trending' | 'adult' | 'movie'
  description?: string
  loading?: boolean
}

const iconMap = {
  globe: Globe,
  trending: TrendingUp,
  adult: AlertTriangle,
  movie: Film,
}

export function DomainStatsCard({
  title,
  value,
  icon,
  description,
  loading = false,
}: DomainStatsCardProps) {
  const Icon = iconMap[icon]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            {description && <Skeleton className="h-4 w-32" />}
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}