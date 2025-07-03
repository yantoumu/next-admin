import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, APIErrorCode } from '@/lib/api-response'
import { APIError } from '@/lib/error-handler'
import { supabase } from '@/lib/supabase'

/**
 * POST /api/auth/logout - 用户登出
 */
export async function POST(request: NextRequest) {
  try {
    // 尝试从Supabase登出
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.warn('Supabase logout warning:', error.message)
      // 即使Supabase登出失败，也继续清除Cookie
    }
    
    // 创建响应并清除认证Cookie
    const response = NextResponse.json(
      createSuccessResponse(null, '登出成功')
    )
    
    // 清除所有认证相关的Cookie
    response.cookies.set('sb-access-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // 立即过期
    })
    
    response.cookies.set('sb-refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // 立即过期
    })
    
    return response
    
  } catch (error) {
    console.error('Logout API Error:', error)
    
    // 已知的API错误
    if (error instanceof APIError) {
      return NextResponse.json(
        createErrorResponse(error.message, error.statusCode, error.code)
      )
    }
    
    // 即使出错也应该清除Cookie
    const response = NextResponse.json(
      createErrorResponse('登出过程中出现错误，但已清除本地会话', 500, APIErrorCode.INTERNAL_ERROR)
    )
    
    // 清除Cookie
    response.cookies.set('sb-access-token', '', { maxAge: 0 })
    response.cookies.set('sb-refresh-token', '', { maxAge: 0 })
    
    return response
  }
}