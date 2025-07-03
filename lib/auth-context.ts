/**
 * 认证上下文 - SOLID依赖注入模式
 * 解决静态渲染时的动态API调用问题
 */

import { User } from '@/types/auth'

export interface AuthContext {
  user: User | null
  isStatic: boolean
}

/**
 * 静态认证提供者 - 用于静态渲染
 */
export class StaticAuthProvider {
  async getUser(): Promise<User | null> {
    // 静态渲染时返回null，避免使用cookies
    return null
  }
}

/**
 * 动态认证提供者 - 用于服务端渲染
 */
export class DynamicAuthProvider {
  async getUser(): Promise<User | null> {
    try {
      // 只在运行时调用cookies
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const accessToken = cookieStore.get('auth-token')?.value
      
      if (!accessToken) {
        return null
      }

      // 实际认证逻辑 - 使用JWT验证
      const { verifyToken } = await import('./auth')
      const { databaseAdapter } = await import('./database-adapter')

      const decoded = await verifyToken(accessToken)
      if (!decoded) {
        return null
      }

      return await databaseAdapter.getUser(decoded.userId)
    } catch (error) {
      console.error('Auth error:', error)
      return null
    }
  }
}

/**
 * 认证工厂 - 根据环境选择合适的提供者
 */
export class AuthProviderFactory {
  static create(isStatic = false) {
    return isStatic ? new StaticAuthProvider() : new DynamicAuthProvider()
  }
}