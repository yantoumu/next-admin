import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { DomainService } from '@/lib/services/domain.service'
import { requireAuth, requirePermission } from '@/lib/auth-middleware'
import { createSuccessResponse, createErrorResponse, handleAPIError } from '@/lib/api-response'

// 更新验证模式
const updateDomainSchema = z.object({
  tld: z.string().max(10).optional(),
  registrationDate: z.string().datetime().optional(),
  expirationDate: z.string().datetime().optional(),
  updatedDate: z.string().datetime().optional(),
  registrar: z.string().max(255).optional(),
  nameservers: z.array(z.string()).optional(),
  globalRank: z.number().int().min(0).optional(),
  monthlyVisits: z.string().optional(), // BigInt as string
  bounceRate: z.number().min(0).max(100).optional(),
  pagesPerVisit: z.number().min(0).optional(),
  avgVisitDuration: z.number().int().min(0).optional(),
  trafficDirect: z.number().min(0).max(100).optional(),
  trafficSearch: z.number().min(0).max(100).optional(),
  trafficSocial: z.number().min(0).max(100).optional(),
  trafficReferral: z.number().min(0).max(100).optional(),
  trafficQueried: z.boolean().optional(),
  whoisQueried: z.boolean().optional(),
  category: z.string().max(100).optional(),
  isAdult: z.boolean().optional(),
  isMovie: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  countryCode: z.string().length(2).optional(),
  countryRank: z.number().int().min(0).optional(),
  lastUpdated: z.string().datetime().optional(),
})

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/domains/[id] - 获取单个域名信息
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()
    await requirePermission('domains.view')

    const { id } = await params
    const domain = await DomainService.findById(id)

    if (!domain) {
      return NextResponse.json(
        createErrorResponse('Domain not found'),
        { status: 404 }
      )
    }

    return NextResponse.json(createSuccessResponse(domain))
  } catch (error) {
    return handleAPIError(error)
  }
}

// PUT /api/domains/[id] - 更新域名信息
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()
    await requirePermission('domains.update')

    const { id } = await params
    const body = await request.json()
    const validated = updateDomainSchema.parse(body)

    // 检查域名是否存在
    const existing = await DomainService.findById(id)
    if (!existing) {
      return NextResponse.json(
        createErrorResponse('Domain not found'),
        { status: 404 }
      )
    }

    // 转换数据类型
    const updateData = {
      ...validated,
      registrationDate: validated.registrationDate ? new Date(validated.registrationDate) : undefined,
      expirationDate: validated.expirationDate ? new Date(validated.expirationDate) : undefined,
      updatedDate: validated.updatedDate ? new Date(validated.updatedDate) : undefined,
      monthlyVisits: validated.monthlyVisits ? BigInt(validated.monthlyVisits) : undefined,
      lastUpdated: validated.lastUpdated ? new Date(validated.lastUpdated) : undefined,
    }

    const domain = await DomainService.update(id, updateData)

    return NextResponse.json(
      createSuccessResponse(domain, 'Domain updated successfully')
    )
  } catch (error) {
    return handleAPIError(error)
  }
}

// DELETE /api/domains/[id] - 删除域名
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()
    await requirePermission('domains.delete')

    const { id } = await params
    
    // 检查域名是否存在
    const existing = await DomainService.findById(id)
    if (!existing) {
      return NextResponse.json(
        createErrorResponse('Domain not found'),
        { status: 404 }
      )
    }

    await DomainService.delete(id)

    return NextResponse.json(
      createSuccessResponse(null, 'Domain deleted successfully')
    )
  } catch (error) {
    return handleAPIError(error)
  }
}