'use client'

import { ReactNode } from 'react'
import { PERMISSIONS, Permission } from '@/lib/permissions'
import { UserRole } from '@/types/auth'

interface PermissionGuardProps {
  /** 要检查的权限 */
  permission: Permission
  /** 用户角色 */
  userRole?: UserRole
  /** 当有权限时显示的内容 */
  children: ReactNode
  /** 当无权限时显示的内容，默认为null */
  fallback?: ReactNode
  /** 是否显示权限错误信息 */
  showError?: boolean
}

/**
 * 权限守卫组件
 * 根据用户角色控制内容的显示
 */
export function PermissionGuard({
  permission,
  userRole,
  children,
  fallback = null,
  showError = false
}: PermissionGuardProps) {
  // 如果没有用户角色，默认无权限
  if (!userRole) {
    return showError ? (
      <div className="text-sm text-muted-foreground p-2 border border-dashed rounded">
        未登录用户无权限访问
      </div>
    ) : (
      <>{fallback}</>
    )
  }

  // 检查用户是否有权限 - 使用类型安全的权限检查函数
  const hasPermission = (PERMISSIONS[permission] as readonly string[])?.includes(userRole) || false

  if (!hasPermission) {
    return showError ? (
      <div className="text-sm text-destructive p-2 border border-dashed border-destructive/20 rounded bg-destructive/5">
        权限不足：需要 {PERMISSIONS[permission]?.join(' 或 ')} 角色
      </div>
    ) : (
      <>{fallback}</>
    )
  }

  return <>{children}</>
}

/**
 * 权限检查Hook
 * 用于在组件内部检查权限
 */
export function usePermission(permission: Permission, userRole?: UserRole): boolean {
  if (!userRole) return false
  return (PERMISSIONS[permission] as readonly string[])?.includes(userRole) || false
}

/**
 * 批量权限检查Hook
 * 检查用户是否具有任一权限
 */
export function useAnyPermission(permissions: Permission[], userRole?: UserRole): boolean {
  if (!userRole) return false
  return permissions.some(permission => 
    (PERMISSIONS[permission] as readonly string[])?.includes(userRole) || false
  )
}

/**
 * 权限信息组件
 * 用于调试和显示权限状态
 */
interface PermissionDebugProps {
  permission: Permission
  userRole?: UserRole
}

export function PermissionDebug({ permission, userRole }: PermissionDebugProps) {
  const hasPermission = usePermission(permission, userRole)
  const requiredRoles = PERMISSIONS[permission]

  return (
    <div className="text-xs text-muted-foreground p-2 border rounded bg-muted/50">
      <div>权限: {permission}</div>
      <div>用户角色: {userRole || '未设置'}</div>
      <div>需要角色: {requiredRoles?.join(', ') || '无限制'}</div>
      <div>权限状态: {hasPermission ? '✅ 有权限' : '❌ 无权限'}</div>
    </div>
  )
}