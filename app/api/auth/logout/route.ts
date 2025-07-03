import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, APIErrorCode } from '@/lib/api-response'
import { APIError } from '@/lib/error-handler'
import { logoutUser } from '@/lib/auth'

/**
 * POST /api/auth/logout - 用户登出
 */
export async function POST(request: NextRequest) {
  try {
    // 使用新的登出函数
    await logoutUser()

    return NextResponse.json(
      createSuccessResponse(null, '登出成功')
    )
    
  } catch (error) {
    console.error('Logout API Error:', error)
    
    // 已知的API错误
    if (error instanceof APIError) {
      return NextResponse.json(
        createErrorResponse(error.message, error.statusCode, error.code)
      )
    }
    
    return NextResponse.json(
      createErrorResponse('登出失败', 500, APIErrorCode.INTERNAL_ERROR)
    )
  }
}