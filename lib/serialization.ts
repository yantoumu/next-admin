/**
 * 🔄 数据序列化工具
 * 解决Server Component向Client Component传递MongoDB对象的序列化问题
 * 
 * 遵循SOLID++原则：
 * - 单一职责：专门处理数据序列化
 * - 开闭原则：可扩展新的序列化类型
 * - 接口隔离：分离序列化逻辑
 * - KISS：简单直接的转换
 * - DRY：统一的序列化工具
 */

import { User, UserRole } from '@/types/auth'
import { Document } from 'mongoose'

/**
 * 序列化安全的用户对象类型
 * 确保所有字段都是JSON安全的，同时保持类型兼容性
 */
export interface SerializedUser {
  id: string
  email: string
  name: string | null
  role: UserRole  // 保持UserRole类型，确保类型兼容性
  created_at: string  // 注意：这里是string，不是Date
  updated_at: string  // 注意：这里是string，不是Date
}

/**
 * 通用序列化函数
 * 将任何对象转换为JSON安全的plain object
 */
export function serialize<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  // 使用JSON.parse(JSON.stringify())确保完全序列化
  // 这会移除所有方法、Symbol、undefined值等
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 序列化用户对象
 * 专门处理MongoDB User Document的序列化
 */
export function serializeUser(user: any): SerializedUser | null {
  if (!user) {
    return null
  }
  
  // 如果是Mongoose Document，先转换为plain object
  const plainUser = user.toJSON ? user.toJSON() : user
  
  // 确保所有字段都是序列化安全的
  const serializedUser: SerializedUser = {
    id: String(plainUser.id || plainUser._id),
    email: String(plainUser.email),
    name: plainUser.name ? String(plainUser.name) : null,
    role: plainUser.role as UserRole, // 保持UserRole类型
    created_at: plainUser.created_at instanceof Date
      ? plainUser.created_at.toISOString()
      : String(plainUser.created_at),
    updated_at: plainUser.updated_at instanceof Date
      ? plainUser.updated_at.toISOString()
      : String(plainUser.updated_at)
  }
  
  // 最终序列化确保完全安全
  return serialize(serializedUser)
}

/**
 * 序列化用户数组
 */
export function serializeUsers(users: any[]): SerializedUser[] {
  if (!Array.isArray(users)) {
    return []
  }
  
  return users.map(user => serializeUser(user)).filter(Boolean) as SerializedUser[]
}

/**
 * 深度序列化对象
 * 处理嵌套对象和数组
 */
export function deepSerialize<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (obj instanceof Date) {
    return obj.toISOString() as unknown as T
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepSerialize(item)) as unknown as T
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {}
    
    for (const [key, value] of Object.entries(obj)) {
      // 跳过函数、Symbol等非序列化字段
      if (typeof value === 'function' || typeof value === 'symbol') {
        continue
      }
      
      // 跳过MongoDB内部字段
      if (key.startsWith('_') && key !== '_id') {
        continue
      }
      
      // 处理_id字段
      if (key === '_id') {
        serialized.id = String(value)
        continue
      }
      
      serialized[key] = deepSerialize(value)
    }
    
    return serialize(serialized)
  }
  
  return obj
}

/**
 * 验证对象是否序列化安全
 * 用于开发时调试
 */
export function isSerializationSafe(obj: any): boolean {
  try {
    JSON.stringify(obj)
    return true
  } catch (error) {
    console.error('Serialization check failed:', error)
    return false
  }
}

/**
 * 序列化检查装饰器
 * 用于开发环境验证
 */
export function withSerializationCheck<T>(obj: T, context?: string): T {
  if (process.env.NODE_ENV === 'development') {
    if (!isSerializationSafe(obj)) {
      console.warn(`Serialization warning in ${context || 'unknown context'}:`, obj)
    }
  }
  return obj
}

/**
 * 类型安全的序列化函数
 * 保持TypeScript类型推断
 */
export function safeSerialize<T extends Record<string, any>>(
  obj: T
): { [K in keyof T]: T[K] extends Date ? string : T[K] } {
  return deepSerialize(obj) as any
}

/**
 * 将SerializedUser转换为User类型（用于权限检查等）
 * 确保类型兼容性
 */
export function toUserType(serializedUser: SerializedUser): User {
  return {
    id: serializedUser.id,
    email: serializedUser.email,
    name: serializedUser.name,
    role: serializedUser.role as any, // 类型转换
    created_at: serializedUser.created_at,
    updated_at: serializedUser.updated_at
  }
}

/**
 * 检查用户权限的兼容性函数
 * 直接使用序列化用户对象进行权限检查
 */
export function hasPermissionSerialized(
  userRole: string,
  permission: string
): boolean {
  // 这里可以直接使用字符串比较，避免类型转换
  // 或者调用原有的权限检查函数
  const { hasPermission } = require('./permissions')
  return hasPermission(userRole as any, permission as any)
}
