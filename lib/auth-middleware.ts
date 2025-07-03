import { redirect } from 'next/navigation'
import { getCurrentUserServer } from './auth'
import { hasPermission, Permission } from './permissions'
import { PAGE_ROUTES } from './constants'
import { User } from '@/types/auth'
import { SerializedUser } from './serialization'

/**
 * 要求用户已认证
 * 如果未认证，重定向到登录页
 * 返回序列化安全的用户对象
 */
export async function requireAuth(): Promise<SerializedUser> {
  const user = await getCurrentUserServer()

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN)
  }

  return user
}

/**
 * 要求用户具有特定权限
 * 如果未认证，重定向到登录页
 * 如果权限不足，重定向到仪表板并显示错误
 * 返回序列化安全的用户对象
 */
export async function requirePermission(permission: Permission): Promise<SerializedUser> {
  const user = await requireAuth()

  if (!hasPermission(user.role as any, permission)) {
    redirect(`${PAGE_ROUTES.DASHBOARD}?error=permission_denied`)
  }

  return user
}

/**
 * 要求用户具有任一权限
 */
export async function requireAnyPermission(permissions: Permission[]): Promise<User> {
  const user = await requireAuth()
  
  const hasAnyPermission = permissions.some(permission => 
    hasPermission(user.role, permission)
  )
  
  if (!hasAnyPermission) {
    redirect(`${PAGE_ROUTES.DASHBOARD}?error=permission_denied`)
  }
  
  return user
}

/**
 * 要求用户具有所有权限
 */
export async function requireAllPermissions(permissions: Permission[]): Promise<User> {
  const user = await requireAuth()
  
  const hasAllPermissions = permissions.every(permission => 
    hasPermission(user.role, permission)
  )
  
  if (!hasAllPermissions) {
    redirect(`${PAGE_ROUTES.DASHBOARD}?error=permission_denied`)
  }
  
  return user
}

/**
 * 可选认证 - 获取用户信息但不强制登录
 */
export async function optionalAuth(): Promise<User | null> {
  try {
    return await getCurrentUserServer()
  } catch (error) {
    console.error('Optional auth error:', error)
    return null
  }
}

/**
 * 检查认证状态但不重定向
 */
export async function checkAuth(): Promise<{ user: User | null; isAuthenticated: boolean }> {
  const user = await optionalAuth()
  return {
    user,
    isAuthenticated: !!user
  }
}

/**
 * 创建权限检查中间件
 */
export function createPermissionMiddleware(permission: Permission) {
  return async (): Promise<User> => {
    return await requirePermission(permission)
  }
}

/**
 * 创建角色检查中间件
 */
export function createRoleMiddleware(allowedRoles: string[]) {
  return async (): Promise<User> => {
    const user = await requireAuth()
    
    if (!allowedRoles.includes(user.role)) {
      redirect(`${PAGE_ROUTES.DASHBOARD}?error=role_denied`)
    }
    
    return user
  }
}