import { Suspense } from 'react'
import { Metadata } from 'next'
import { DomainList } from '@/components/domains/domain-list'
import { DomainFilter } from '@/components/domains/domain-filter'
import { DomainSearch } from '@/components/domains/domain-search'
import { getDomains, getAvailableCategories, getAvailableTlds } from '@/lib/services/domain.service'
import { DomainFilterValues } from '@/components/domains/domain-filter'
import { requirePermission } from '@/lib/auth-context'

export const metadata: Metadata = {
  title: '域名管理 | 站找词',
  description: '查看和管理域名数据'
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    category?: string
    tld?: string
    trending?: string
    adult?: string
    movie?: string
    rankRange?: string
  }>
}

export default async function DomainsPage({ searchParams }: PageProps) {
  await requirePermission('domains.view')

  // 解析查询参数 (Next.js 15: searchParams is async)
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1')
  const search = resolvedSearchParams.search || ''
  
  const filters: DomainFilterValues = {
    categories: resolvedSearchParams.category ? [resolvedSearchParams.category] : [],
    isAdult: resolvedSearchParams.adult === 'true' ? true : null,
    isMovie: resolvedSearchParams.movie === 'true' ? true : null,
    isTrending: resolvedSearchParams.trending === 'true' ? true : null,
    tld: resolvedSearchParams.tld || null,
    rankRange: (resolvedSearchParams.rankRange as any) || 'all'
  }

  // 并行获取数据
  const [domainsData, categories, tlds] = await Promise.all([
    getDomains({
      page,
      search,
      filters,
      pageSize: 20
    }),
    getAvailableCategories(),
    getAvailableTlds()
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">域名管理</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <DomainFilter
            availableCategories={categories}
            availableTlds={tlds}
            initialFilters={filters}
            onFilterChange={() => {
              // 由于是服务端组件，筛选通过URL参数处理
            }}
          />
        </div>

        <div className="md:col-span-3 space-y-4">
          <DomainSearch
            defaultValue={search}
            onSearch={() => {
              // 由于是服务端组件，搜索通过URL参数处理
            }}
          />

          <Suspense fallback={<DomainListSkeleton />}>
            <DomainList
              domains={domainsData.domains}
              totalCount={domainsData.totalCount}
              currentPage={page}
              pageSize={20}
              onPageChange={() => {
                // 由于是服务端组件，分页通过URL参数处理
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function DomainListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
      ))}
    </div>
  )
}