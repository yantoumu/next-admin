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
   * 深度克隆对象
   */
  deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.deepClone(item)) as unknown as T
    }
    
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key])
      }
    }
    
    return cloned
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
  },

  /**
   * 设置嵌套对象的值
   */
  set<T extends Record<string, any>>(obj: T, path: string, value: any): T {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    
    let current: any = obj
    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {}
      }
      current = current[key]
    }
    
    current[lastKey] = value
    return obj
  },

  /**
   * 检查对象是否为空
   */
  isEmpty(obj: any): boolean {
    if (obj == null) return true
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0
    return Object.keys(obj).length === 0
  },

  /**
   * 选择对象的指定键
   */
  pick<T extends Record<string, any>, K extends keyof T>(
    obj: T, 
    keys: K[]
  ): Pick<T, K> {
    const result = {} as Pick<T, K>
    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key]
      }
    }
    return result
  },

  /**
   * 排除对象的指定键
   */
  omit<T extends Record<string, any>, K extends keyof T>(
    obj: T, 
    keys: K[]
  ): Omit<T, K> {
    const result = { ...obj }
    for (const key of keys) {
      delete result[key]
    }
    return result
  },

  /**
   * 对象键值对调换
   */
  invert<T extends Record<string, string>>(obj: T): Record<string, string> {
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[value] = key
    }
    return result
  }
}