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
  },

  /**
   * 获取两个日期之间的天数差
   */
  getDaysDifference(date1: Date | string, date2: Date | string): number {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const timeDiff = Math.abs(d2.getTime() - d1.getTime())
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  },

  /**
   * 添加天数到日期
   */
  addDays(date: Date | string, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  },

  /**
   * 获取本周开始日期（周一）
   */
  getWeekStart(date: Date | string = new Date()): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  },

  /**
   * 获取本月开始日期
   */
  getMonthStart(date: Date | string = new Date()): Date {
    const d = new Date(date)
    return new Date(d.getFullYear(), d.getMonth(), 1)
  }
}