import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 重新导出所有工具函数
export * from './date-utils'
export * from './file-utils'
export * from './string-utils'
export * from './array-utils'
export * from './object-utils'
export * from './url-utils'