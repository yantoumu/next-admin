import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { UserService, SafeUser } from '@/lib/services/user.service'
import { UserRole } from '@prisma/client'
import { PAGE_ROUTES } from './constants'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

/**
 * PostgreSQL认证系统
 * 
 * 安全特性：
 * - JWT token验证和管理
 * - 密码安全哈希验证
 * - 账户锁定机制
 * - 会话管理和黑名单
 * - SQL注入防护（Prisma）
 */

/**
 * 清除无效的认证token
 */
async function clearAuthToken(): Promise<void> {
  try {
    const cookieStore = cookies()
    cookieStore.delete('auth-token')
  } catch (error) {
    console.error('Error clearing auth token:', error)
  }
}

/**
 * 验证JWT token格式和基本结构
 */
function validateJWTFormat(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false
  }

  // JWT应该有3个部分，用.分隔
  const parts = token.split('.')
  if (parts.length !== 3) {
    return false
  }

  // 检查每个部分是否为有效的base64
  try {
    for (const part of parts) {
      if (!part || part.length === 0) {
        return false
      }
      // 尝试解码base64（JWT使用base64url编码）
      Buffer.from(part, 'base64')
    }
    return true
  } catch {
    return false
  }
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      console.log('No auth token found in cookies')
      return null
    }

    // 验证token格式
    if (!validateJWTFormat(token)) {
      console.error('Invalid JWT format')
      await clearAuthToken()
      return null
    }

    // 验证JWT_SECRET是否存在
    if (!JWT_SECRET || JWT_SECRET === 'your-secret-key') {
      console.error('JWT_SECRET is not properly configured')
      return null
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any
    } catch (jwtError: any) {
      console.error('JWT verification failed:', {
        error: jwtError.message,
        tokenLength: token.length,
        secretLength: JWT_SECRET.length,
        tokenStart: token.substring(0, 20) + '...'
      })
      
      // 清除无效token
      await clearAuthToken()
      return null
    }

    // 验证decoded payload结构
    if (!decoded || !decoded.userId) {
      console.error('Invalid JWT payload: missing userId')
      await clearAuthToken()
      return null
    }

    // 检查token是否在黑名单中
    const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex')
    const session = await prisma.userSession.findUnique({
      where: { token_hash: tokenHash }
    })

    if (session && session.revoked_at) {
      console.error('Token has been revoked')
      await clearAuthToken()
      return null
    }

    // 获取用户信息
    const user = await UserService.getUserById(decoded.userId)

    if (!user) {
      console.error('User not found for userId:', decoded.userId)
      await clearAuthToken()
      return null
    }

    // 检查账户是否被锁定
    if (user.locked_until && user.locked_until > new Date()) {
      console.error('User account is locked until:', user.locked_until)
      await clearAuthToken()
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * 服务端获取当前用户（用于页面组件）
 */
export async function getCurrentUserServer(): Promise<SafeUser | null> {
  return await getCurrentUser()
}

/**
 * 用户登录
 */
export async function loginUser(email: string, password: string, ipAddress?: string) {
  try {
    console.log('🔍 查找用户:', { email })

    // 获取用户信息（包含密码）
    const user = await UserService.getUserByEmailWithPassword(email)
    console.log('📊 查询结果:', {
      found: !!user,
      userEmail: user?.email,
      hasPassword: !!user?.password
    })

    if (!user) {
      // 检查数据库中是否有任何用户
      const stats = await UserService.getUserStats()
      console.log('📈 数据库用户总数:', stats.total)

      if (stats.total === 0) {
        throw new Error('数据库中没有用户数据，请先初始化数据')
      } else {
        throw new Error('用户不存在')
      }
    }

    // 检查账户是否被锁定
    if (user.locked_until && user.locked_until > new Date()) {
      throw new Error('账户已被锁定，请稍后再试')
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password!)
    
    if (!isValidPassword) {
      // 更新登录失败信息
      await UserService.updateLoginInfo(user.id, false, ipAddress)
      throw new Error('密码错误')
    }

    // 验证JWT_SECRET配置
    if (!JWT_SECRET || JWT_SECRET === 'your-secret-key') {
      console.error('JWT_SECRET is not properly configured for login')
      throw new Error('服务器配置错误')
    }

    // 生成JWT token with enhanced payload
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000), // issued at
      jti: `${user.id}_${Date.now()}` // JWT ID for uniqueness
    }

    const token = jwt.sign(payload, JWT_SECRET, { 
      expiresIn: '7d',
      algorithm: 'HS256' // 明确指定算法
    })

    console.log('Generated JWT token for user:', {
      userId: user.id,
      email: user.email,
      tokenLength: token.length,
      secretLength: JWT_SECRET.length
    })

    // 创建会话记录
    const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex')
    await prisma.userSession.create({
      data: {
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天
        ip_address: ipAddress,
        user_agent: undefined // 可以从请求头获取
      }
    })

    // 设置cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/' // 确保cookie在整个应用中可用
    })

    // 更新登录成功信息
    await UserService.updateLoginInfo(user.id, true, ipAddress)

    // 返回用户信息（不包含密码）
    const { password: _, ...safeUser } = user
    return safeUser
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * 用户登出
 */
export async function logoutUser(): Promise<void> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (token) {
      // 将token加入黑名单
      const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex')
      await prisma.userSession.updateMany({
        where: { token_hash: tokenHash },
        data: { revoked_at: new Date() }
      })
    }

    // 清除cookie
    cookieStore.delete('auth-token')
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

/**
 * 权限检查中间件
 */
export async function requireAuth(): Promise<SafeUser> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN)
  }
  
  return user
}

/**
 * 角色权限检查
 */
export async function requireRole(requiredRole: UserRole): Promise<SafeUser> {
  const user = await requireAuth()
  
  const roleHierarchy = {
    [UserRole.VIEWER]: 0,
    [UserRole.MEMBER]: 1,
    [UserRole.ADMIN]: 2,
    [UserRole.SUPER_ADMIN]: 3
  }
  
  if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
    redirect(PAGE_ROUTES.UNAUTHORIZED)
  }
  
  return user
}
