import { Suspense } from 'react'
import { requirePermission } from '@/lib/auth-context'
import { getDomains } from '@/lib/services/domain.service'
import { DomainSearch } from '@/components/domains/domain-search'
import { TrafficCvList } from '@/components/domains/traffic-cv-list'

interface PageProps {
  searchParams: Promise<{ 
    page?: string
    search?: string
    sort?: string
  }>
}

// 加载骨架屏
function DomainListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function DomainsPage({ searchParams }: PageProps) {
  await requirePermission('domains.view')
  
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const search = params.search || ''
  const sort = params.sort || 'search-results'
  
  // 获取域名数据
  const domainsData = await getDomains({
    page,
    pageSize: 20,
    search,
    sort  // 传递 Traffic.cv 风格的排序参数
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">域名流量排行榜</h1>
          <p className="text-sm text-gray-600 mt-1">
            查看和分析域名的流量数据、增长趋势和关键词排名
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* 搜索框 */}
          <DomainSearch
            defaultValue={search}
            placeholder="搜索域名、标题或描述..."
          />

          {/* 域名列表 */}
          <Suspense fallback={<DomainListSkeleton />}>
            <TrafficCvList
              domains={domainsData.domains}
              totalCount={domainsData.totalCount}
              currentPage={page}
              pageSize={20}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}