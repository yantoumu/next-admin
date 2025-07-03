import { z } from 'zod'

/**
 * 通用设置验证Schema
 */
export const generalSettingsSchema = z.object({
  systemName: z.string().min(1, "系统名称不能为空").max(100, "系统名称不能超过100字符"),
  systemDescription: z.string().optional().default(""),
  systemUrl: z.string().url("请输入有效的URL").optional(),
  timezone: z.string().min(1, "请选择时区"),
  language: z.string().min(1, "请选择语言"),
  dateFormat: z.string().min(1, "请选择日期格式"),
  favicon: z.string().optional().default("/favicon.ico"),
  logo: z.string().optional().default("/logo.png")
})

/**
 * 安全设置验证Schema
 */
export const securitySettingsSchema = z.object({
  enableTwoFactor: z.boolean().default(false),
  sessionTimeout: z.number().min(5, "会话超时不能少于5分钟").max(1440, "会话超时不能超过24小时").default(30),
  passwordMinLength: z.number().min(6, "密码最小长度不能少于6位").max(32, "密码最小长度不能超过32位").default(8),
  passwordRequireUppercase: z.boolean().default(true),
  passwordRequireLowercase: z.boolean().default(true),
  passwordRequireNumbers: z.boolean().default(true),
  passwordRequireSymbols: z.boolean().default(false),
  loginAttemptLimit: z.number().min(3, "登录尝试限制不能少于3次").max(10, "登录尝试限制不能超过10次").default(5),
  lockoutDuration: z.number().min(5, "锁定时间不能少于5分钟").max(60, "锁定时间不能超过60分钟").default(15)
})

/**
 * 系统设置验证Schema（合并所有设置）
 */
export const systemSettingsSchema = z.object({
  general: generalSettingsSchema.optional(),
  security: securitySettingsSchema.optional()
})

/**
 * 单个设置项验证Schema
 */
export const settingItemSchema = z.object({
  key: z.string().min(1, "设置键不能为空"),
  value: z.any(), // 值可以是任意类型
  type: z.enum(['string', 'number', 'boolean', 'json']).default('string'),
  description: z.string().optional()
})

// 导出类型
export type GeneralSettings = z.infer<typeof generalSettingsSchema>
export type SecuritySettings = z.infer<typeof securitySettingsSchema>
export type SystemSettings = z.infer<typeof systemSettingsSchema>
export type SettingItem = z.infer<typeof settingItemSchema>