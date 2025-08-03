/**
 * 域名增长率计算工具
 * 基于 monthly_trend 数据计算真实的增长率
 */

interface MonthlyTrend {
  [key: string]: number  // date -> visits
}

interface GrowthData {
  growthVolume: number    // 增长量
  growthRate: number      // 增长率（百分比）
  previousValue: number   // 上期数值
  currentValue: number    // 当前数值
}

/**
 * 计算域名的增长数据
 * @param monthlyTrend - 月度趋势数据
 * @param currentVisits - 当前访问量
 * @returns 增长数据
 */
export function calculateDomainGrowth(
  monthlyTrend: MonthlyTrend | null | undefined,
  currentVisits: string | number | null | undefined
): GrowthData {
  // 默认值
  const defaultGrowth: GrowthData = {
    growthVolume: 0,
    growthRate: 0,
    previousValue: 0,
    currentValue: 0
  }

  // 如果没有趋势数据，返回默认值
  if (!monthlyTrend || typeof monthlyTrend !== 'object') {
    return defaultGrowth
  }

  // 获取当前访问量
  const current = currentVisits 
    ? (typeof currentVisits === 'string' ? parseInt(currentVisits) : currentVisits)
    : 0

  // 将趋势数据按日期排序
  const sortedEntries = Object.entries(monthlyTrend)
    .filter(([_, value]) => typeof value === 'number' && value > 0)
    .sort(([a], [b]) => b.localeCompare(a)) // 降序排序，最新日期在前

  // 如果没有历史数据
  if (sortedEntries.length < 2) {
    return {
      ...defaultGrowth,
      currentValue: current
    }
  }

  // 获取最近两个月的数据
  const [currentMonth, currentMonthValue] = sortedEntries[0]
  const [previousMonth, previousMonthValue] = sortedEntries[1]

  // 计算增长量
  const growthVolume = currentMonthValue - previousMonthValue

  // 计算增长率（避免除零）
  const growthRate = previousMonthValue > 0 
    ? ((growthVolume / previousMonthValue) * 100)
    : 0

  return {
    growthVolume,
    growthRate: Math.round(growthRate * 10) / 10, // 保留一位小数
    previousValue: previousMonthValue,
    currentValue: currentMonthValue
  }
}

/**
 * 格式化增长率显示
 * @param rate - 增长率
 * @returns 格式化的字符串
 */
export function formatGrowthRate(rate: number): string {
  const sign = rate > 0 ? '+' : ''
  return `${sign}${rate.toFixed(1)}%`
}

/**
 * 获取增长趋势
 * @param rate - 增长率
 * @returns 'up' | 'down' | 'stable'
 */
export function getGrowthTrend(rate: number): 'up' | 'down' | 'stable' {
  if (rate > 0.5) return 'up'
  if (rate < -0.5) return 'down'
  return 'stable'
}