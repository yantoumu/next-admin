import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'
import { Prisma } from '@prisma/client'

interface KeywordAnalysisResult {
  domains: Array<{
    id: string
    domain: string
    globalRank?: number
    monthlyVisits?: string
    trafficGrowth?: number
    growthRate?: number
    registrationDate?: string
    category?: string
  }>
  totalResults: number
}

/**
 * 获取关键词分析数据
 * 搜索包含关键词的域名，并返回流量数据
 */
export const getKeywordAnalysis = unstable_cache(
  async (keyword: string): Promise<KeywordAnalysisResult> => {
    try {
      // 搜索域名中包含关键词的记录
      // 或者在top_keywords字段中包含该关键词的域名
      const domains = await prisma.domainInfo.findMany({
        where: {
          OR: [
            {
              domain: {
                contains: keyword,
                mode: 'insensitive'
              }
            },
            {
              title: {
                contains: keyword,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: keyword,
                mode: 'insensitive'
              }
            },
            // TODO: 实现JSON字段搜索
            // 目前Prisma不直接支持JSON字段的模糊搜索
            // 需要使用原生SQL查询或者其他方案
          ]
        },
        select: {
          id: true,
          domain: true,
          global_rank: true,
          monthly_visits: true,
          category: true,
          category_name: true,
          registration_date: true,
          bounce_rate: true,
          created_at: true,
          updated_at: true
        },
        orderBy: {
          monthly_visits: 'desc'
        },
        take: 50 // 限制返回50个结果
      })

      // 转换数据格式并计算增长率（这里使用模拟数据，实际应该基于历史数据计算）
      const transformedDomains = domains.map(domain => {
        // 模拟流量增长数据（实际应该从历史数据计算）
        const growthRate = domain.monthly_visits ? Math.floor(Math.random() * 40) - 10 : 0
        const previousVisits = domain.monthly_visits 
          ? Number(domain.monthly_visits) / (1 + growthRate / 100)
          : 0
        const trafficGrowth = domain.monthly_visits 
          ? Number(domain.monthly_visits) - previousVisits
          : 0

        return {
          id: domain.id.toString(),
          domain: domain.domain,
          globalRank: domain.global_rank ? Number(domain.global_rank) : undefined,
          monthlyVisits: domain.monthly_visits ? domain.monthly_visits.toString() : undefined,
          trafficGrowth: Math.round(trafficGrowth),
          growthRate,
          registrationDate: domain.registration_date?.toISOString(),
          category: domain.category_name || domain.category || undefined
        }
      })

      return {
        domains: transformedDomains,
        totalResults: transformedDomains.length
      }
    } catch (error) {
      console.error('Failed to get keyword analysis:', error)
      return {
        domains: [],
        totalResults: 0
      }
    }
  },
  ['keyword-analysis'],
  {
    revalidate: 300, // 缓存5分钟
    tags: ['keywords']
  }
)

/**
 * 获取热门关键词
 * 从所有域名的top_keywords中提取最受欢迎的关键词
 */
export const getPopularKeywords = unstable_cache(
  async (limit: number = 20) => {
    try {
      // 获取所有域名的top_keywords
      const domains = await prisma.domainInfo.findMany({
        where: {
          top_keywords: {
            not: Prisma.JsonNull
          }
        },
        select: {
          top_keywords: true
        }
      })

      // 聚合所有关键词并计算总流量
      const keywordMap = new Map<string, { volume: number, traffic: number, count: number }>()

      domains.forEach(domain => {
        const keywords = domain.top_keywords as Array<{
          keyword: string
          volume: number
          traffic: number
        }> | null

        if (keywords && Array.isArray(keywords)) {
          keywords.forEach(kw => {
            const existing = keywordMap.get(kw.keyword) || { volume: 0, traffic: 0, count: 0 }
            keywordMap.set(kw.keyword, {
              volume: existing.volume + (kw.volume || 0),
              traffic: existing.traffic + (kw.traffic || 0),
              count: existing.count + 1
            })
          })
        }
      })

      // 转换为数组并排序
      const popularKeywords = Array.from(keywordMap.entries())
        .map(([keyword, data]) => ({
          keyword,
          totalVolume: data.volume,
          totalTraffic: data.traffic,
          domainCount: data.count
        }))
        .sort((a, b) => b.totalTraffic - a.totalTraffic)
        .slice(0, limit)

      return popularKeywords
    } catch (error) {
      console.error('Failed to get popular keywords:', error)
      return []
    }
  },
  ['popular-keywords'],
  {
    revalidate: 3600, // 缓存1小时
    tags: ['keywords']
  }
)