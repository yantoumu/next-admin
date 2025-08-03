import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requirePermission } from '@/lib/auth-middleware'
import { createSuccessResponse, createErrorResponse, handleAPIError } from '@/lib/api-response'
import { getDomainTrendData } from '@/lib/services/domain.service'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/domains/[id]/trend - 获取域名趋势数据
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()
    await requirePermission('domains.view')

    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') as '7d' | '30d' | '90d' || '30d'
    
    // 获取趋势数据
    const trendData = await getDomainTrendData(id, period)
    
    // 设置缓存头
    const response = NextResponse.json(createSuccessResponse(trendData))
    
    // 缓存5分钟
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    )
    
    return response
  } catch (error) {
    return handleAPIError(error)
  }
}