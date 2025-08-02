import { prisma } from '@/lib/db'
import { User, UserRole, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { CreateUserRequest, UpdateUserRequest } from '@/types/auth'

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
  static async getUserById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { 
          id,
          deleted_at: null // 排除软删除的用户
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          created_at: true,
          updated_at: true,
          last_login: true,
          login_attempts: true,
          locked_until: true,
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
          email: email.toLowerCase().trim(),
          deleted_at: null
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
          email: email.toLowerCase().trim(),
          deleted_at: null
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          created_at: true,
          updated_at: true,
          last_login: true,
          login_attempts: true,
          locked_until: true,
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
          role: userData.role || UserRole.MEMBER,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          created_at: true,
          updated_at: true,
          last_login: true,
          login_attempts: true,
          locked_until: true,
        }
      })

      // 记录审计日志
      await this.logAudit(newUser.id, 'CREATE', 'users', { 
        email: newUser.email, 
        role: newUser.role 
      })

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
        where: { 
          id,
          deleted_at: null
        },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          created_at: true,
          updated_at: true,
          last_login: true,
          login_attempts: true,
          locked_until: true,
        }
      })

      // 记录审计日志
      await this.logAudit(id, 'UPDATE', 'users', updates)

      return updatedUser
    } catch (error) {
      console.error('更新用户失败:', error)
      throw new Error('更新用户信息失败')
    }
  }

  /**
   * 软删除用户
   */
  static async deleteUser(id: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { 
          deleted_at: new Date()
        }
      })

      // 记录审计日志
      await this.logAudit(id, 'DELETE', 'users', { user_id: id })
    } catch (error) {
      console.error('删除用户失败:', error)
      throw new Error('删除用户失败')
    }
  }

  /**
   * 更新登录信息
   */
  static async updateLoginInfo(id: string, success: boolean, ipAddress?: string): Promise<void> {
    try {
      if (success) {
        // 登录成功：重置失败次数，更新最后登录时间
        await prisma.user.update({
          where: { id },
          data: {
            last_login: new Date(),
            login_attempts: 0,
            locked_until: null
          }
        })
      } else {
        // 登录失败：增加失败次数
        const user = await prisma.user.findUnique({
          where: { id },
          select: { login_attempts: true }
        })

        const attempts = (user?.login_attempts || 0) + 1
        const lockUntil = attempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null // 5次失败锁定30分钟

        await prisma.user.update({
          where: { id },
          data: {
            login_attempts: attempts,
            locked_until: lockUntil
          }
        })
      }
    } catch (error) {
      console.error('更新登录信息失败:', error)
    }
  }

  /**
   * 记录审计日志
   */
  private static async logAudit(
    userId: string | null, 
    action: string, 
    resource: string, 
    details: any,
    ipAddress?: string
  ): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          user_id: userId,
          action,
          resource,
          details,
          ip_address: ipAddress
        }
      })
    } catch (error) {
      console.error('记录审计日志失败:', error)
      // 审计日志失败不应该影响主要操作
    }
  }

  /**
   * 获取用户统计信息
   */
  static async getUserStats() {
    try {
      const [total, byRole] = await Promise.all([
        prisma.user.count({
          where: { deleted_at: null }
        }),
        prisma.user.groupBy({
          by: ['role'],
          where: { deleted_at: null },
          _count: true
        })
      ])

      return {
        total,
        byRole: byRole.reduce((acc, item) => {
          acc[item.role] = item._count
          return acc
        }, {} as Record<string, number>)
      }
    } catch (error) {
      console.error('获取用户统计失败:', error)
      throw new Error('获取用户统计失败')
    }
  }
}
