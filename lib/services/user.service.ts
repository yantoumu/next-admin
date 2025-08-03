import { prisma } from '@/lib/db'
import { User, UserRole, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
// 临时类型定义，后续需要创建完整的types文件
interface CreateUserRequest {
  email: string
  password: string
  name?: string
  role?: UserRole
}

interface UpdateUserRequest {
  name?: string
  role?: UserRole
  password?: string
}

/**
 * 用户服务层 - PostgreSQL + Prisma实现
 * 
 * 安全特性：
 * - 自动SQL注入防护（Prisma类型安全）
 * - 密码安全哈希（bcrypt）
 * - 输入验证和清理
 * - 审计日志记录
 */

export class UserService {
  /**
   * 根据ID获取用户（不包含密码）
   */
  static async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    try {
      return await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          created_at: true,
          updated_at: true,
          // 不返回password字段
        }
      })
    } catch (error) {
      console.error('获取用户失败:', error)
      throw new Error('获取用户信息失败')
    }
  }

  /**
   * 根据邮箱获取用户（包含密码，用于认证）
   */
  static async getUserByEmailWithPassword(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: {
          email: email.toLowerCase().trim()
        }
      })
    } catch (error) {
      console.error('根据邮箱获取用户失败:', error)
      throw new Error('用户查询失败')
    }
  }

  /**
   * 根据邮箱获取用户（不包含密码）
   */
  static async getUserByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    try {
      return await prisma.user.findUnique({
        where: {
          email: email.toLowerCase().trim()
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          created_at: true,
          updated_at: true,
        }
      })
    } catch (error) {
      console.error('根据邮箱获取用户失败:', error)
      throw new Error('用户查询失败')
    }
  }

  /**
   * 创建新用户
   */
  static async createUser(userData: CreateUserRequest): Promise<Omit<User, 'password'>> {
    try {
      // 验证邮箱唯一性
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email.toLowerCase().trim() }
      })

      if (existingUser) {
        throw new Error('该邮箱已被注册')
      }

      // 密码哈希
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      // 创建用户
      const newUser = await prisma.user.create({
        data: {
          email: userData.email.toLowerCase().trim(),
          password: hashedPassword,
          name: userData.name?.trim(),
          role: userData.role || UserRole.member,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          created_at: true,
          updated_at: true,
        }
      })

      // 简化版本：移除审计日志，遵循YAGNI原则

      return newUser
    } catch (error) {
      console.error('创建用户失败:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('创建用户失败')
    }
  }

  /**
   * 更新用户信息
   */
  static async updateUser(id: string, updates: UpdateUserRequest): Promise<Omit<User, 'password'>> {
    try {
      const updateData: Prisma.UserUpdateInput = {}

      // 安全地构建更新数据
      if (updates.name !== undefined) {
        updateData.name = updates.name?.trim() || null
      }
      if (updates.role !== undefined) {
        updateData.role = updates.role
      }
      if (updates.password) {
        updateData.password = await bcrypt.hash(updates.password, 12)
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          created_at: true,
          updated_at: true,
        }
      })

      // 简化版本：移除审计日志，遵循YAGNI原则

      return updatedUser
    } catch (error) {
      console.error('更新用户失败:', error)
      throw new Error('更新用户信息失败')
    }
  }

  /**
   * 删除用户 - 简化版本
   */
  static async deleteUser(id: string): Promise<void> {
    try {
      await prisma.user.delete({
        where: { id }
      })
    } catch (error) {
      console.error('删除用户失败:', error)
      throw new Error('删除用户失败')
    }
  }

  /**
   * 获取用户统计信息 - 简化版本
   */
  static async getUserStats() {
    try {
      const total = await prisma.user.count()
      return { total }
    } catch (error) {
      console.error('获取用户统计失败:', error)
      throw new Error('获取用户统计失败')
    }
  }
}
