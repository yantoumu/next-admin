'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// 动态导入重型组件，实现代码分割
const DomainTrendChart = dynamic(
  () => import('./domain-trend-chart').then(mod => mod.DomainTrendChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false // 仅在客户端渲染
  }
)

const DomainStatsCard = dynamic(
  () => import('./domain-stats-card').then(mod => mod.DomainStatsCard),
  {
    loading: () => <CardSkeleton />
  }
)

interface DomainDetailModalProps {
  domainId: string
  domainName: string
}

export function DomainDetailModal({ domainId, domainName }: DomainDetailModalProps) {
  const [showChart, setShowChart] = useState(false)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <DomainStatsCard
          title="全球排名"
          value="#1,234"
          icon="globe"
          description="较上周上升 5%"
        />
        <DomainStatsCard
          title="月访问量"
          value="1.2M"
          icon="trending"
          description="较上月增长 12%"
        />
      </div>

      <Button
        onClick={() => setShowChart(!showChart)}
        variant="outline"
        className="w-full"
      >
        {showChart ? '隐藏' : '显示'}流量趋势图
      </Button>

      {showChart && (
        <DomainTrendChart
          domainName={domainName}
          period={period}
          onPeriodChange={setPeriod}
          data={[]} // 实际应从API获取
        />
      )}
    </div>
  )
}

function ChartSkeleton() {
  return <Skeleton className="h-[300px] w-full" />
}

function CardSkeleton() {
  return <Skeleton className="h-24 w-full" />
}