'use client'

import { useEffect, useState } from 'react'
import { DomainTrendChart } from './domain-trend-chart'

interface DomainTrendChartContainerProps {
  domainId: string
  period: '7d' | '30d' | '90d'
  onPeriodChange: (period: '7d' | '30d' | '90d') => void
}

export function DomainTrendChartContainer({
  domainId,
  period,
  onPeriodChange
}: DomainTrendChartContainerProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch(`/api/domains/${domainId}/trend?period=${period}`)
        if (response.ok) {
          const result = await response.json()
          setData(result.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch trend data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [domainId, period])
  
  return (
    <DomainTrendChart
      domainName=""
      data={data}
      loading={loading}
      period={period}
      onPeriodChange={onPeriodChange}
    />
  )
}