import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, APIErrorCode } from '@/lib/api-response'
import { requirePermission } from '@/lib/auth-middleware'
import { systemSettingsSchema } from '@/lib/validations/settings'
import { APIError } from '@/lib/error-handler'
import fs from 'fs/promises'
import path from 'path'

// 设置文件路径
const SETTINGS_FILE = path.join(process.cwd(), 'config', 'settings.json')

// 默认设置
const DEFAULT_SETTINGS = {
  general: {
    systemName: '管理后台',
    systemDescription: 'Next.js 15 管理系统',
    systemUrl: 'https://admin.example.com',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    dateFormat: 'YYYY-MM-DD',
    favicon: '/favicon.ico',
    logo: '/logo.png'
  },
  security: {
    enableTwoFactor: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: false,
    loginAttemptLimit: 5,
    lockoutDuration: 15
  }
}

/**
 * 确保设置文件和目录存在
 */
async function ensureSettingsFile() {
  try {
    const configDir = path.dirname(SETTINGS_FILE)
    
    // 确保配置目录存在
    try {
      await fs.access(configDir)
    } catch {
      await fs.mkdir(configDir, { recursive: true })
    }
    
    // 检查设置文件是否存在
    try {
      await fs.access(SETTINGS_FILE)
    } catch {
      // 文件不存在，创建默认设置文件
      await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2))
    }
  } catch (error) {
    console.error('Error ensuring settings file:', error)
    throw new APIError('设置文件操作失败', 500, APIErrorCode.INTERNAL_ERROR)
  }
}

/**
 * 读取设置
 */
async function readSettings() {
  try {
    await ensureSettingsFile()
    const settingsContent = await fs.readFile(SETTINGS_FILE, 'utf-8')
    return JSON.parse(settingsContent)
  } catch (error) {
    console.error('Error reading settings:', error)
    return DEFAULT_SETTINGS
  }
}

/**
 * 写入设置
 */
async function writeSettings(settings: any) {
  try {
    await ensureSettingsFile()
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2))
  } catch (error) {
    console.error('Error writing settings:', error)
    throw new APIError('设置保存失败', 500, APIErrorCode.INTERNAL_ERROR)
  }
}

/**
 * GET /api/settings - 获取系统设置
 */
export async function GET(request: NextRequest) {
  try {
    // 检查权限：只有admin+可以查看系统设置
    await requirePermission('settings.view')
    
    // 读取设置
    const settings = await readSettings()
    
    return NextResponse.json(
      createSuccessResponse(settings, '设置获取成功')
    )
    
  } catch (error) {
    console.error('Settings GET API Error:', error)
    
    // 已知的API错误
    if (error instanceof APIError) {
      return NextResponse.json(
        createErrorResponse(error.message, error.statusCode, error.code)
      )
    }
    
    // 未知错误
    return NextResponse.json(
      createErrorResponse('获取设置失败', 500, APIErrorCode.INTERNAL_ERROR)
    )
  }
}

/**
 * PUT /api/settings - 更新系统设置
 */
export async function PUT(request: NextRequest) {
  try {
    // 检查权限：只有super_admin可以编辑系统设置
    await requirePermission('settings.edit')
    
    const body = await request.json()
    
    // 验证输入数据
    const validatedData = systemSettingsSchema.parse(body)
    
    // 读取当前设置
    const currentSettings = await readSettings()
    
    // 合并设置（只更新提供的部分）
    const updatedSettings = {
      ...currentSettings,
      ...validatedData
    }
    
    // 如果提供了general设置，进行深度合并
    if (validatedData.general) {
      updatedSettings.general = {
        ...currentSettings.general,
        ...validatedData.general
      }
    }
    
    // 如果提供了security设置，进行深度合并
    if (validatedData.security) {
      updatedSettings.security = {
        ...currentSettings.security,
        ...validatedData.security
      }
    }
    
    // 保存更新后的设置
    await writeSettings(updatedSettings)
    
    return NextResponse.json(
      createSuccessResponse(updatedSettings, '设置更新成功')
    )
    
  } catch (error) {
    console.error('Settings PUT API Error:', error)
    
    // 已知的API错误
    if (error instanceof APIError) {
      return NextResponse.json(
        createErrorResponse(error.message, error.statusCode, error.code)
      )
    }
    
    // 未知错误
    return NextResponse.json(
      createErrorResponse('设置更新失败', 500, APIErrorCode.INTERNAL_ERROR)
    )
  }
}