import { UserRole } from '@/types/auth'

/**
 * 权限矩阵 - 明确定义每个角色能访问什么
 */
export const PERMISSIONS = {
  // 用户管理
  'users.view': ['super_admin', 'admin', 'editor'],
  'users.create': ['super_admin', 'admin'], 
  'users.edit': ['super_admin', 'admin'],
  'users.delete': ['super_admin'],
  
  // 系统设置
  'settings.view': ['super_admin', 'admin'],
  'settings.edit': ['super_admin'],
  
  // 仪表板
  'dashboard.view': ['super_admin', 'admin', 'editor', 'member', 'viewer'],
  
  // 个人资料
  'profile.view': ['super_admin', 'admin', 'editor', 'member', 'viewer'],
  'profile.edit': ['super_admin', 'admin', 'editor', 'member', 'viewer'],
  
  // 内容管理 (editor特有权限)
  'content.view': ['super_admin', 'admin', 'editor'],
  'content.edit': ['super_admin', 'admin', 'editor'],
  'content.create': ['super_admin', 'admin', 'editor'],
  'content.delete': ['super_admin', 'admin'],
} as const

export type Permission = keyof typeof PERMISSIONS

/**
 * 检查用户是否具有指定权限
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission] as readonly string[]
  return allowedRoles.includes(userRole)
}

/**
 * 检查用户是否具有任一权限
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission))
}

/**
 * 检查用户是否具有所有权限
 */
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission))
}

/**
 * 获取用户所有权限列表
 */
export function getUserPermissions(userRole: UserRole): Permission[] {
  return Object.keys(PERMISSIONS).filter(permission => 
    hasPermission(userRole, permission as Permission)
  ) as Permission[]
}

/**
 * 权限级别比较
 */
export function isHigherRole(roleA: UserRole, roleB: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    'viewer': 1,
    'member': 2,
    'editor': 3,
    'admin': 4,
    'super_admin': 5
  }
  
  return roleHierarchy[roleA] > roleHierarchy[roleB]
}

/**
 * 检查是否可以管理目标用户
 */
export function canManageUser(currentUserRole: UserRole, targetUserRole: UserRole): boolean {
  // 超级管理员可以管理所有人
  if (currentUserRole === 'super_admin') {
    return true
  }
  
  // 管理员可以管理编辑员、成员和访客，但不能管理其他管理员
  if (currentUserRole === 'admin') {
    return ['editor', 'member', 'viewer'].includes(targetUserRole)
  }
  
  // 编辑员可以管理成员和访客
  if (currentUserRole === 'editor') {
    return ['member', 'viewer'].includes(targetUserRole)
  }
  
  // 其他角色不能管理任何人
  return false
}