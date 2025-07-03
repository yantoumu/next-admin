import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createSuccessResponse, createErrorResponse, APIErrorCode } from '@/lib/api-response'
import { APIError, UnauthorizedError } from '@/lib/error-handler'
import { getCurrentUserServer } from '@/lib/auth'

const prisma = new PrismaClient()

/**
 * GET /api/auth/me - 获取当前用户信息
 */
export async function GET(request: NextRequest) {
  try {
    // 获取当前用户
    const currentUser = await getCurrentUserServer()
    
    if (!currentUser) {
      throw new UnauthorizedError('未登录或会话已过期')
    }
    
    // 从数据库获取最新的用户信息
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
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
    
    if (!user) {
      throw new UnauthorizedError('用户不存在')
    }
    
    return NextResponse.json(
      createSuccessResponse(user, '用户信息获取成功')
    )
    
  } catch (error) {
    console.error('Me API Error:', error)
    
    // 已知的API错误
    if (error instanceof APIError) {
      return NextResponse.json(
        createErrorResponse(error.message, error.statusCode, error.code)
      )
    }
    
    // 未知错误
    return NextResponse.json(
      createErrorResponse('获取用户信息失败', 500, APIErrorCode.INTERNAL_ERROR)
    )
  }
}