import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { createSuccessResponse, createErrorResponse, APIErrorCode } from '@/lib/api-response'
import { loginSchema } from '@/lib/validations/auth'
import { APIError, UnauthorizedError } from '@/lib/error-handler'
import { supabase } from '@/lib/supabase'

const prisma = new PrismaClient()

/**
 * POST /api/auth/login - 用户登录
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证输入数据
    const validatedData = loginSchema.parse(body)
    const { email, password, remember } = validatedData
    
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        created_at: true,
        updated_at: true,
      }
    })
    
    if (!user || !user.password) {
      throw new UnauthorizedError('邮箱或密码错误')
    }
    
    // 验证密码
    const [hash, salt] = user.password.split(':')
    const inputHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex')
    
    if (hash !== inputHash) {
      throw new UnauthorizedError('邮箱或密码错误')
    }
    
    // 使用Supabase进行认证
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: `fallback_${email}` // 使用fallback密码
    })
    
    // 如果Supabase认证失败，使用JWT模式
    let sessionData = null
    if (authError) {
      // 创建自定义会话令牌
      const sessionToken = crypto.randomBytes(32).toString('hex')
      sessionData = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        session: {
          access_token: sessionToken,
          token_type: 'bearer',
          expires_in: remember ? 7 * 24 * 60 * 60 : 24 * 60 * 60, // 7天 or 1天
          refresh_token: crypto.randomBytes(32).toString('hex')
        }
      }
    } else {
      sessionData = authData
    }
    
    // 设置认证Cookie
    const response = NextResponse.json(
      createSuccessResponse({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        session: sessionData?.session
      }, '登录成功')
    )
    
    // 设置HttpOnly Cookie
    if (sessionData?.session?.access_token) {
      response.cookies.set('sb-access-token', sessionData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: sessionData.session.expires_in
      })
      
      if (sessionData.session.refresh_token) {
        response.cookies.set('sb-refresh-token', sessionData.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 // 30天
        })
      }
    }
    
    return response
    
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