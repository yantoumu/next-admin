import { NextRequest, NextResponse } from 'next/server'
import { DomainService } from '@/lib/services/domain.service'
import { requireAuth, requirePermission } from '@/lib/auth-middleware'
import { createSuccessResponse, handleAPIError } from '@/lib/api-response'

// GET /api/domains/top - 获取流量最高的域名
export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    await requirePermission('domains.view')

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const domains = await DomainService.getTopDomains(limit)

    return NextResponse.json(createSuccessResponse(domains))
  } catch (error) {
    return handleAPIError(error)
  }
}