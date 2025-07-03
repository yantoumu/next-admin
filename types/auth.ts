export type UserRole = 'super_admin' | 'admin' | 'member' | 'viewer'

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

/**
 * 序列化安全的用户类型
 * 用于Server Component向Client Component传递数据
 */
export interface SerializedUser {
  id: string
  email: string
  name: string | null
  role: string  // 注意：这里是string而不是UserRole枚举
  created_at: string
  updated_at: string
}

export interface AuthContext {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

export interface CreateUserRequest {
  email: string
  name: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: UserRole
  password?: string
}

/**
 * 角色兼容性映射 - 支持旧系统角色名称
 */
export const ROLE_COMPATIBILITY = {
  'administrator': 'admin',
  'user': 'member'
} as const

/**
 * 角色显示名称映射
 */
export const ROLE_DISPLAY_NAMES = {
  'super_admin': '超级管理员',
  'admin': '管理员',
  'member': '成员',
  'viewer': '访客'
} as const