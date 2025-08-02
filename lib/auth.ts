import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { User, UserRole } from '@/types/auth'
import { PAGE_ROUTES } from './constants'
import dbConnect from './db'
import UserModel from './models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { serializeUser, SerializedUser } from './serialization'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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
 * 获取当前用户信息 (客户端)
 * 返回序列化安全的用户对象
 */
export async function getCurrentUser(): Promise<SerializedUser | null> {
  try {
    const cookieStore = await cookies()
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

    await dbConnect()
    const user = await UserModel.findById(decoded.userId).select('-password')

    if (!user) {
      console.error('User not found for userId:', decoded.userId)
      await clearAuthToken()
      return null
    }

    // 使用序列化函数确保返回的对象是序列化安全的
    return serializeUser(user)
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * 获取当前用户信息 (服务端) - 优化版
 * 支持静态渲染，避免Dynamic Server Usage错误
 * 返回序列化安全的用户对象
 */
export async function getCurrentUserServer(isStatic = false): Promise<SerializedUser | null> {
  try {
    // 静态渲染时直接返回null，避免使用cookies
    if (isStatic) {
      return null
    }

    return await getCurrentUser()
  } catch (error) {
    console.error('Error getting current user (server):', error)
    return null
  }
}

/**
 * 用户登录
 */
export async function loginUser(email: string, password: string) {
  try {
    await dbConnect()

    // 查找用户 - 添加调试日志
    console.log('🔍 查找用户:', { email, modelName: UserModel.modelName })

    const user = await UserModel.findOne({ email }).select('+password')
    console.log('📊 查询结果:', {
      found: !!user,
      userEmail: user?.email,
      hasPassword: !!user?.password
    })

    if (!user) {
      // 检查数据库中是否有任何用户
      const totalUsers = await UserModel.countDocuments()
      console.log('📈 数据库用户总数:', totalUsers)

      if (totalUsers === 0) {
        throw new Error('数据库中没有用户数据，请先初始化数据')
      } else {
        throw new Error('用户不存在')
      }
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password!)
    if (!isValidPassword) {
      throw new Error('密码错误')
    }

    // 验证JWT_SECRET配置
    if (!JWT_SECRET || JWT_SECRET === 'your-secret-key') {
      console.error('JWT_SECRET is not properly configured for login')
      throw new Error('服务器配置错误')
    }

    // 生成JWT token with enhanced payload
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000), // issued at
      jti: `${user._id}_${Date.now()}` // JWT ID for uniqueness
    }

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
      algorithm: 'HS256' // 明确指定算法
    })

    console.log('Generated JWT token for user:', {
      userId: user._id.toString(),
      email: user.email,
      tokenLength: token.length,
      secretLength: JWT_SECRET.length
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

    return { user: user.toJSON(), token }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * 用户注册
 */
export async function registerUser(email: string, password: string, name: string, role: UserRole = 'member') {
  try {
    await dbConnect()

    // 检查用户是否已存在
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      throw new Error('用户已存在')
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12)

    // 创建用户
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      name,
      role
    })

    return user.toJSON()
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

/**
 * 用户登出
 */
export async function logoutUser() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

/**
 * 重置密码 (简化版本，实际项目中需要邮件服务)
 */
export async function resetPassword(email: string, newPassword: string) {
  try {
    await dbConnect()

    const user = await UserModel.findOne({ email })
    if (!user) {
      throw new Error('用户不存在')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword })

    return { success: true }
  } catch (error) {
    console.error('Reset password error:', error)
    throw error
  }
}

/**
 * 验证JWT token
 */
export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

