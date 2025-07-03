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
   * 根据对象属性去重
   */
  uniqueBy<T, K extends keyof T>(array: T[], key: K): T[] {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
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
  },

  /**
   * 多字段排序
   */
  multiSort<T>(array: T[], keys: Array<{ key: keyof T; order?: 'asc' | 'desc' }>): T[] {
    return [...array].sort((a, b) => {
      for (const { key, order = 'asc' } of keys) {
        const aValue = a[key]
        const bValue = b[key]
        
        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
      }
      return 0
    })
  },

  /**
   * 打乱数组
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  },

  /**
   * 随机选择元素
   */
  sample<T>(array: T[], count: number = 1): T[] {
    const shuffled = this.shuffle(array)
    return shuffled.slice(0, count)
  },

  /**
   * 数组求和
   */
  sum(array: number[]): number {
    return array.reduce((sum, num) => sum + num, 0)
  },

  /**
   * 数组平均值
   */
  average(array: number[]): number {
    return array.length > 0 ? this.sum(array) / array.length : 0
  },

  /**
   * 数组最大值
   */
  max(array: number[]): number {
    return Math.max(...array)
  },

  /**
   * 数组最小值
   */
  min(array: number[]): number {
    return Math.min(...array)
  }
}