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
 * 获取当前用户信息 (客户端)
 * 返回序列化安全的用户对象
 */
export async function getCurrentUser(): Promise<SerializedUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any

    await dbConnect()
    const user = await UserModel.findById(decoded.userId).select('-password')

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

    // 查找用户
    const user = await UserModel.findOne({ email }).select('+password')
    if (!user) {
      throw new Error('用户不存在')
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password!)
    if (!isValidPassword) {
      throw new Error('密码错误')
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 设置cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
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

