import { z } from 'zod'
import { UserRole } from '@/types/auth'

/**
 * 创建用户验证Schema
 */
export const createUserSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少8位"),
  confirmPassword: z.string(),
  role: z.enum(['super_admin', 'admin', 'member', 'viewer'])
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次密码输入不一致",
  path: ["confirmPassword"],
})

/**
 * 更新用户验证Schema
 */
export const updateUserSchema = z.object({
  name: z.string().min(1, "姓名不能为空").optional(),
  email: z.string().email("请输入有效的邮箱地址").optional(),
  password: z.string().min(8, "密码至少8位").optional(),
  role: z.enum(['super_admin', 'admin', 'member', 'viewer']).optional(),
})

/**
 * 用户查询参数验证Schema
 */
export const usersQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  search: z.string().optional(),
  role: z.enum(['super_admin', 'admin', 'member', 'viewer']).optional(),
  sort: z.enum(['name', 'email', 'created_at']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
})

/**
 * 用户ID参数验证Schema
 */
export const userIdSchema = z.object({
  id: z.string().min(1, "用户ID不能为空"),
})

// 导出类型
export type CreateUserData = z.infer<typeof createUserSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
export type UsersQuery = z.infer<typeof usersQuerySchema>
export type UserIdParams = z.infer<typeof userIdSchema>