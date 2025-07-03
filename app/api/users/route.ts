import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { createSuccessResponse, createErrorResponse, createPaginatedResponse, APIErrorCode } from '@/lib/api-response'
import { requirePermission } from '@/lib/auth-middleware'
import { createUserSchema, usersQuerySchema } from '@/lib/validations/user'
import { APIError } from '@/lib/error-handler'

const prisma = new PrismaClient()

/**
 * GET /api/users - 获取用户列表（分页、搜索、筛选、排序）
 */
export async function GET(request: NextRequest) {
  try {
    // 检查权限：只有admin+可以查看用户列表
    await requirePermission('users.view')
    
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams)
    
    // 验证查询参数
    const { page, limit, search, role, sort, order } = usersQuerySchema.parse(queryParams)
    
    // 构建查询条件
    const where: any = {}
    
    // 搜索条件
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // 角色筛选
    if (role) {
      where.role = role
    }
    
    // 计算分页
    const skip = (page - 1) * limit
    
    // 构建排序
    const orderBy: any = {}
    orderBy[sort] = order
    
    // 执行查询
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          created_at: true,
          updated_at: true,
          // 不返回密码字段
        }
      }),
      prisma.user.count({ where })
    ])
    
    // 计算分页信息
    const totalPages = Math.ceil(total / limit)
    const pagination = {
      current: page,
      total,
      pages: totalPages,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
    
    return NextResponse.json(
      createPaginatedResponse(users, page, limit, total, '用户列表获取成功')
    )
  } catch (error) {
    console.error('API Error:', error)
    
    // 已知的API错误
    if (error instanceof APIError) {
      return NextResponse.json(
        createErrorResponse(error.message, error.statusCode, error.code)
      )
    }
    
    // 未知错误
    return NextResponse.json(
      createErrorResponse('服务器内部错误', 500, APIErrorCode.INTERNAL_ERROR)
    )
  }
}

/**
 * POST /api/users - 创建新用户
 */
export async function POST(request: NextRequest) {
  try {
    // 检查权限：只有admin+可以创建用户
    await requirePermission('users.create')
    
    const body = await request.json()
    
    // 验证输入数据
    const validatedData = createUserSchema.parse(body)
    const { name, email, password, role } = validatedData
    
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        createErrorResponse('该邮箱已被注册', 409, APIErrorCode.VALIDATION_ERROR)
      )
    }
    
    // 加密密码 (使用SHA-256 + salt)
    const salt = crypto.randomBytes(16).toString('hex')
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex') + ':' + salt
    
    // 创建用户
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        created_at: true,
        updated_at: true,
        // 不返回密码字段
      }
    })
    
    return NextResponse.json(
      createSuccessResponse(newUser, '用户创建成功'),
      { status: 201 }
    )
  } catch (error) {
    console.error('API Error:', error)
    
    // 已知的API错误
    if (error instanceof APIError) {
      return NextResponse.json(
        createErrorResponse(error.message, error.statusCode, error.code)
      )
    }
    
    // 未知错误
    return NextResponse.json(
      createErrorResponse('服务器内部错误', 500, APIErrorCode.INTERNAL_ERROR)
    )
  }
}