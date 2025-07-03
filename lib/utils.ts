import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 日期格式化工具
 */
export const dateUtils = {
  /**
   * 格式化日期为 YYYY-MM-DD
   */
  formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  },

  /**
   * 格式化日期时间为 YYYY-MM-DD HH:mm:ss
   */
  formatDateTime(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  },

  /**
   * 格式化相对时间 (如：2小时前)
   */
  formatRelativeTime(date: Date | string): string {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}天前`
    if (hours > 0) return `${hours}小时前`
    if (minutes > 0) return `${minutes}分钟前`
    return '刚刚'
  },

  /**
   * 判断是否为有效日期
   */
  isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime())
  }
}

/**
 * 文件大小格式化工具
 */
export const fileUtils = {
  /**
   * 格式化文件大小 (如：1.5 MB)
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    const k = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`
  },

  /**
   * 获取文件扩展名
   */
  getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
  },

  /**
   * 检查是否为图片文件
   */
  isImageFile(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    const ext = this.getFileExtension(filename).toLowerCase()
    return imageExtensions.includes(ext)
  },

  /**
   * 生成安全的文件名
   */
  sanitizeFileName(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
  }
}

/**
 * 字符串处理工具
 */
export const stringUtils = {
  /**
   * 截断字符串并添加省略号
   */
  truncate(str: string, length: number): string {
    if (str.length <= length) return str
    return str.substring(0, length) + '...'
  },

  /**
   * 转换为首字母大写
   */
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  /**
   * 转换为驼峰命名
   */
  toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '')
  },

  /**
   * 转换为短横线命名
   */
  toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase()
  },

  /**
   * 生成随机字符串
   */
  generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  /**
   * 验证邮箱格式
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * 验证手机号格式（中国大陆）
   */
  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }
}

/**
 * 数组处理工具
 */
export const arrayUtils = {
  /**
   * 数组去重
   */
  unique<T>(array: T[]): T[] {
    return [...new Set(array)]
  },

  /**
   * 数组分组
   */
  groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key])
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(item)
      return groups
    }, {} as Record<string, T[]>)
  },

  /**
   * 数组分块
   */
  chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  },

  /**
   * 数组排序
   */
  sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const aValue = a[key]
      const bValue = b[key]
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1
      if (aValue > bValue) return order === 'asc' ? 1 : -1
      return 0
    })
  }
}

/**
 * 对象处理工具
 */
export const objectUtils = {
  /**
   * 深度合并对象
   */
  deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    const result = { ...target }
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const sourceValue = source[key]
        const targetValue = result[key]
        
        if (
          sourceValue &&
          typeof sourceValue === 'object' &&
          !Array.isArray(sourceValue) &&
          targetValue &&
          typeof targetValue === 'object' &&
          !Array.isArray(targetValue)
        ) {
          result[key] = this.deepMerge(targetValue, sourceValue)
        } else {
          result[key] = sourceValue as T[Extract<keyof T, string>]
        }
      }
    }
    
    return result
  },

  /**
   * 移除对象中的空值
   */
  removeEmpty<T extends Record<string, any>>(obj: T): Partial<T> {
    const result: Partial<T> = {}
    
    for (const key in obj) {
      const value = obj[key]
      if (value !== null && value !== undefined && value !== '') {
        result[key] = value
      }
    }
    
    return result
  },

  /**
   * 获取嵌套对象的值
   */
  get<T>(obj: any, path: string, defaultValue?: T): T | undefined {
    const keys = path.split('.')
    let result = obj
    
    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue
      }
      result = result[key]
    }
    
    return result !== undefined ? result : defaultValue
  }
}

/**
 * URL和查询参数工具
 */
export const urlUtils = {
  /**
   * 构建查询字符串
   */
  buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams()
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value))
      }
    }
    
    return searchParams.toString()
  },

  /**
   * 解析查询字符串
   */
  parseQueryString(queryString: string): Record<string, string> {
    const params: Record<string, string> = {}
    const searchParams = new URLSearchParams(queryString)
    
    for (const [key, value] of searchParams.entries()) {
      params[key] = value
    }
    
    return params
  },

  /**
   * 判断是否为有效URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}