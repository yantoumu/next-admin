import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, APIErrorCode } from '@/lib/api-response'
import { loginSchema } from '@/lib/validations/auth'
import { APIError, UnauthorizedError } from '@/lib/error-handler'
import { loginUser } from '@/lib/auth'

/**
 * POST /api/auth/login - 用户登录
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证输入数据
    const validatedData = loginSchema.parse(body)
    const { email, password } = validatedData

    // 使用新的认证系统
    const result = await loginUser(email, password)

    return NextResponse.json(
      createSuccessResponse({
        user: result.user
      }, '登录成功')
    )
    
  } catch (error) {
    console.error('Login API Error:', error)
    
    // 已知的API错误
    if (error instanceof APIError) {
      return NextResponse.json(
        createErrorResponse(error.message, error.statusCode, error.code)
      )
    }
    
    // 未知错误
    return NextResponse.json(
      createErrorResponse('登录失败，请稍后重试', 500, APIErrorCode.INTERNAL_ERROR)
    )
  }
}