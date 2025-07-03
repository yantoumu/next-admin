import { z } from 'zod'

/**
 * 登录请求验证Schema
 */
export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "密码不能为空"),
  remember: z.boolean().optional().default(false)
})

/**
 * 注册请求验证Schema
 */
export const registerSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少8位"),
  confirmPassword: z.string(),
  name: z.string().min(1, "姓名不能为空"),
  role: z.enum(['super_admin', 'admin', 'member', 'viewer']).optional().default('member')
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次密码输入不一致",
  path: ["confirmPassword"],
})

/**
 * 修改密码验证Schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z.string().min(8, "新密码至少8位"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "两次密码输入不一致",
  path: ["confirmPassword"],
})

/**
 * 重置密码请求验证Schema
 */
export const resetPasswordRequestSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址")
})

/**
 * 重置密码验证Schema
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "重置令牌不能为空"),
  password: z.string().min(8, "密码至少8位"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次密码输入不一致",
  path: ["confirmPassword"],
})

// 导出类型
export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
export type ChangePasswordData = z.infer<typeof changePasswordSchema>
export type ResetPasswordRequestData = z.infer<typeof resetPasswordRequestSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>