/**
 * 认证上下文 - SOLID依赖注入模式
 * 解决静态渲染时的动态API调用问题
 */

import { User } from '@/types/auth'

/**
 * 将SafeUser转换为User类型
 * 解决Date vs string类型不兼容问题
 */
function safeUserToUser(safeUser: any): User {
  return {
    id: safeUser.id,
    email: safeUser.email,
    name: safeUser.name,
    role: safeUser.role,
    created_at: safeUser.created_at.toISOString(),
    updated_at: safeUser.updated_at.toISOString()
  }
}

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

      // 简化认证逻辑 - 直接使用PostgreSQL认证系统
      const { getCurrentUser } = await import('./auth')

      // 从cookie中获取用户信息（PostgreSQL版本）
      const safeUser = await getCurrentUser()
      return safeUser ? safeUserToUser(safeUser) : null
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

/**
 * 简化的认证检查函数 - 重新导出auth.ts的函数
 */
export async function requireAuth() {
  const { requireAuth: authRequireAuth } = await import('./auth')
  return authRequireAuth()
}

/**
 * 权限检查函数 - 基于role的权限验证
 */
export async function requirePermission(permission: string) {
  const user = await requireAuth()
  
  // 简化权限检查 - 基于角色层级
  const rolePermissions: Record<string, string[]> = {
    'viewer': ['dashboard.view', 'profile.*'],
    'member': ['dashboard.view', 'profile.*', 'users.view'],
    'admin': ['dashboard.view', 'profile.*', 'users.*'],
    'super_admin': ['*'] // 超级管理员拥有所有权限
  }
  
  const userPermissions = rolePermissions[user.role] || []
  
  // 检查是否有通配符权限或具体权限
  const hasPermission = userPermissions.includes('*') || 
    userPermissions.some(p => {
      if (p.endsWith('*')) {
        const prefix = p.slice(0, -1)
        return permission.startsWith(prefix)
      }
      return p === permission
    })
  
  if (!hasPermission) {
    throw new Error(`Permission denied: ${permission}`)
  }
  
  return user
}