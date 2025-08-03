import { NextRequest, NextResponse } from 'next/server'
import { getDomains } from '@/lib/services/domain.service'
import { DomainFilterValues } from '@/components/domains/domain-filter'
import { requireAuth } from '@/lib/auth-context'

export async function GET(request: NextRequest) {
  try {
    // 验证权限
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 解析查询参数
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') as any || 'globalRank'
    const sortOrder = searchParams.get('sortOrder') as any || 'asc'

    // 解析筛选条件
    const filters: DomainFilterValues = {
      categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
      isAdult: searchParams.get('isAdult') === 'true' ? true : null,
      isMovie: searchParams.get('isMovie') === 'true' ? true : null,
      isTrending: searchParams.get('isTrending') === 'true' ? true : null,
      tld: searchParams.get('tld') || null,
      rankRange: (searchParams.get('rankRange') as any) || 'all'
    }

    // 获取数据
    const result = await getDomains({
      page,
      pageSize,
      search,
      filters,
      sortBy,
      sortOrder
    })

    // 设置缓存头
    const response = NextResponse.json(result)
    
    // 缓存60秒，允许过期后异步更新
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
    
    // 设置 ETag 用于条件请求
    const etag = `W/"${page}-${search}-${JSON.stringify(filters)}"`
    response.headers.set('ETag', etag)
    
    // 检查条件请求
    const ifNoneMatch = request.headers.get('If-None-Match')
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 })
    }

    return response
  } catch (error) {
    console.error('Failed to fetch domains:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}