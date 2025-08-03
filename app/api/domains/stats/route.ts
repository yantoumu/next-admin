import { NextRequest, NextResponse } from 'next/server'
import { DomainService } from '@/lib/services/domain.service'
import { requireAuth, requirePermission } from '@/lib/auth-middleware'
import { createSuccessResponse, handleAPIError } from '@/lib/api-response'

// GET /api/domains/stats - 获取域名统计信息
export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    await requirePermission('domains.view')

    const stats = await DomainService.getStats()

    return NextResponse.json(createSuccessResponse(stats))
  } catch (error) {
    return handleAPIError(error)
  }
}