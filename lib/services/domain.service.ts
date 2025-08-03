import { prisma } from '@/lib/db'
import { DomainInfo, Prisma } from '@prisma/client'
import { DomainFilterValues } from '@/components/domains/domain-filter'
import { unstable_cache } from 'next/cache'

export interface DomainInfoCreateInput {
  domain: string
  tld?: string
  registrationDate?: Date
  expirationDate?: Date
  updatedDate?: Date
  registrar?: string
  nameservers?: string[]
  globalRank?: number
  monthlyVisits?: bigint
  bounceRate?: number
  pagesPerVisit?: number
  avgVisitDuration?: number
  trafficDirect?: number
  trafficSearch?: number
  trafficSocial?: number
  trafficReferral?: number
  trafficQueried?: boolean
  whoisQueried?: boolean
  category?: string
  isAdult?: boolean
  isMovie?: boolean
  isTrending?: boolean
  countryCode?: string
  countryRank?: number
  topCountries?: Array<{ code: string; percentage: number }>
  topKeywords?: Array<{ keyword: string; volume: number; traffic: number; cpc?: string }>
  categoryRank?: number
  domainStatus?: string[]
  title?: string
  description?: string
  categoryName?: string
  trafficPeriod?: string
  trafficPaid?: number
  trafficMail?: number
  monthlyTrend?: Record<string, number>
  lastUpdated?: Date
}

export interface DomainQueryOptions {
  page?: number
  pageSize?: number
  search?: string
  filters?: DomainFilterValues
  sortBy?: 'globalRank' | 'monthlyVisits' | 'bounceRate' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface DomainInfoUpdateInput extends Partial<DomainInfoCreateInput> {}

export interface DomainInfoFilter {
  search?: string
  tld?: string
  minGlobalRank?: number
  maxGlobalRank?: number
  countryCode?: string
  category?: string
  isAdult?: boolean
  isMovie?: boolean
  isTrending?: boolean
  trafficQueried?: boolean
  whoisQueried?: boolean
}

export interface DomainInfoSort {
  field: 'domain' | 'globalRank' | 'monthlyVisits' | 'createdAt' | 'updatedAt'
  order: 'asc' | 'desc'
}

export interface PaginationParams {
  page: number
  pageSize: number
}

// 序列化域名数据，处理BigInt字段
function serializeDomainInfo(domain: any) {
  if (!domain) return null

  return {
    ...domain,
    id: domain.id.toString(),
    global_rank: domain.global_rank ? Number(domain.global_rank) : null,
    monthly_visits: domain.monthly_visits ? domain.monthly_visits.toString() : null,
    country_rank: domain.country_rank ? Number(domain.country_rank) : null,
    avg_visit_duration: domain.avg_visit_duration ? Number(domain.avg_visit_duration) : null,
    bounce_rate: domain.bounce_rate ? Number(domain.bounce_rate) : null,
    pages_per_visit: domain.pages_per_visit ? Number(domain.pages_per_visit) : null,
    traffic_direct: domain.traffic_direct ? Number(domain.traffic_direct) : null,
    traffic_search: domain.traffic_search ? Number(domain.traffic_search) : null,
    traffic_social: domain.traffic_social ? Number(domain.traffic_social) : null,
    traffic_referral: domain.traffic_referral ? Number(domain.traffic_referral) : null,
    traffic_paid: domain.traffic_paid ? Number(domain.traffic_paid) : null,
    traffic_mail: domain.traffic_mail ? Number(domain.traffic_mail) : null,
  }
}

export class DomainService {
  // 创建域名信息
  static async create(data: DomainInfoCreateInput): Promise<DomainInfo> {
    return prisma.domainInfo.create({
      data: {
        domain: data.domain,
        tld: data.tld,
        registration_date: data.registrationDate,
        expiration_date: data.expirationDate,
        updated_date: data.updatedDate,
        registrar: data.registrar,
        nameservers: data.nameservers || [],
        global_rank: data.globalRank,
        monthly_visits: data.monthlyVisits,
        bounce_rate: data.bounceRate,
        pages_per_visit: data.pagesPerVisit,
        avg_visit_duration: data.avgVisitDuration,
        traffic_direct: data.trafficDirect,
        traffic_search: data.trafficSearch,
        traffic_social: data.trafficSocial,
        traffic_referral: data.trafficReferral,
        traffic_queried: data.trafficQueried,
        whois_queried: data.whoisQueried,
        category: data.category,
        is_adult: data.isAdult,
        is_movie: data.isMovie,
        is_trending: data.isTrending,
        country_code: data.countryCode,
        country_rank: data.countryRank,
        top_countries: data.topCountries ? JSON.parse(JSON.stringify(data.topCountries)) : undefined,
        top_keywords: data.topKeywords ? JSON.parse(JSON.stringify(data.topKeywords)) : undefined,
        category_rank: data.categoryRank,
        domain_status: data.domainStatus,
        title: data.title,
        description: data.description,
        category_name: data.categoryName,
        traffic_period: data.trafficPeriod,
        traffic_paid: data.trafficPaid,
        traffic_mail: data.trafficMail,
        monthly_trend: data.monthlyTrend ? JSON.parse(JSON.stringify(data.monthlyTrend)) : undefined,
        last_updated: data.lastUpdated,
      },
    })
  }

  // 通过ID获取域名信息
  static async findById(id: string | number | bigint): Promise<any> {
    const domain = await prisma.domainInfo.findUnique({
      where: { id: BigInt(id) },
    })
    return serializeDomainInfo(domain)
  }

  // 通过域名获取信息
  static async findByDomain(domain: string): Promise<any> {
    const domainInfo = await prisma.domainInfo.findUnique({
      where: { domain },
    })
    return serializeDomainInfo(domainInfo)
  }

  // 更新域名信息
  static async update(id: string | number | bigint, data: DomainInfoUpdateInput): Promise<DomainInfo> {
    return prisma.domainInfo.update({
      where: { id: BigInt(id) },
      data: {
        tld: data.tld,
        registration_date: data.registrationDate,
        expiration_date: data.expirationDate,
        updated_date: data.updatedDate,
        registrar: data.registrar,
        nameservers: data.nameservers,
        global_rank: data.globalRank,
        monthly_visits: data.monthlyVisits,
        bounce_rate: data.bounceRate,
        pages_per_visit: data.pagesPerVisit,
        avg_visit_duration: data.avgVisitDuration,
        traffic_direct: data.trafficDirect,
        traffic_search: data.trafficSearch,
        traffic_social: data.trafficSocial,
        traffic_referral: data.trafficReferral,
        traffic_queried: data.trafficQueried,
        whois_queried: data.whoisQueried,
        category: data.category,
        is_adult: data.isAdult,
        is_movie: data.isMovie,
        is_trending: data.isTrending,
        country_code: data.countryCode,
        country_rank: data.countryRank,
        top_countries: data.topCountries ? JSON.parse(JSON.stringify(data.topCountries)) : undefined,
        top_keywords: data.topKeywords ? JSON.parse(JSON.stringify(data.topKeywords)) : undefined,
        category_rank: data.categoryRank,
        domain_status: data.domainStatus,
        title: data.title,
        description: data.description,
        category_name: data.categoryName,
        traffic_period: data.trafficPeriod,
        traffic_paid: data.trafficPaid,
        traffic_mail: data.trafficMail,
        monthly_trend: data.monthlyTrend ? JSON.parse(JSON.stringify(data.monthlyTrend)) : undefined,
        last_updated: data.lastUpdated,
      },
    })
  }

  // 删除域名信息
  static async delete(id: string | number | bigint): Promise<DomainInfo> {
    return prisma.domainInfo.delete({
      where: { id: BigInt(id) },
    })
  }

  // 批量删除
  static async deleteMany(ids: (string | number | bigint)[]): Promise<number> {
    const result = await prisma.domainInfo.deleteMany({
      where: {
        id: { in: ids.map(id => BigInt(id)) },
      },
    })
    return result.count
  }

  // 搜索和过滤域名信息
  static async findMany(
    filter?: DomainInfoFilter,
    sort?: DomainInfoSort,
    pagination?: PaginationParams
  ): Promise<{ data: DomainInfo[]; total: number }> {
    const where: Prisma.DomainInfoWhereInput = {}

    // 构建过滤条件
    if (filter) {
      if (filter.search) {
        where.OR = [
          { domain: { contains: filter.search, mode: 'insensitive' } },
          { registrar: { contains: filter.search, mode: 'insensitive' } },
          { category: { contains: filter.search, mode: 'insensitive' } },
        ]
      }

      if (filter.tld) {
        where.tld = filter.tld
      }

      if (filter.minGlobalRank !== undefined || filter.maxGlobalRank !== undefined) {
        where.global_rank = {}
        if (filter.minGlobalRank !== undefined) {
          where.global_rank.gte = filter.minGlobalRank
        }
        if (filter.maxGlobalRank !== undefined) {
          where.global_rank.lte = filter.maxGlobalRank
        }
      }

      if (filter.countryCode) {
        where.country_code = filter.countryCode
      }

      if (filter.category) {
        where.category = { contains: filter.category, mode: 'insensitive' }
      }

      if (filter.isAdult !== undefined) {
        where.is_adult = filter.isAdult
      }

      if (filter.isMovie !== undefined) {
        where.is_movie = filter.isMovie
      }

      if (filter.isTrending !== undefined) {
        where.is_trending = filter.isTrending
      }

      if (filter.trafficQueried !== undefined) {
        where.traffic_queried = filter.trafficQueried
      }

      if (filter.whoisQueried !== undefined) {
        where.whois_queried = filter.whoisQueried
      }
    }

    // 构建排序
    const orderBy: Prisma.DomainInfoOrderByWithRelationInput = {}
    if (sort) {
      orderBy[sort.field === 'globalRank' ? 'global_rank' : 
             sort.field === 'monthlyVisits' ? 'monthly_visits' :
             sort.field === 'createdAt' ? 'created_at' :
             sort.field === 'updatedAt' ? 'updated_at' :
             sort.field] = sort.order
    } else {
      orderBy.created_at = 'desc'
    }

    // 执行查询
    const [data, total] = await Promise.all([
      prisma.domainInfo.findMany({
        where,
        orderBy,
        ...(pagination && {
          skip: (pagination.page - 1) * pagination.pageSize,
          take: pagination.pageSize,
        }),
      }),
      prisma.domainInfo.count({ where }),
    ])

    return { data, total }
  }

  // 获取热门域名（按流量排序）
  static async getTopDomains(limit: number = 10): Promise<DomainInfo[]> {
    return prisma.domainInfo.findMany({
      where: {
        monthly_visits: { not: null },
      },
      orderBy: {
        monthly_visits: 'desc',
      },
      take: limit,
    })
  }

  // 获取趋势域名
  static async getTrendingDomains(limit: number = 10): Promise<DomainInfo[]> {
    return prisma.domainInfo.findMany({
      where: {
        is_trending: true,
      },
      orderBy: {
        monthly_visits: 'desc',
      },
      take: limit,
    })
  }

  // 获取域名统计信息
  static async getStats(): Promise<{
    totalDomains: number
    totalTrendingDomains: number
    totalAdultDomains: number
    totalMovieDomains: number
    avgMonthlyVisits: number | null
  }> {
    const [
      totalDomains,
      totalTrendingDomains,
      totalAdultDomains,
      totalMovieDomains,
      avgVisitsResult,
    ] = await Promise.all([
      prisma.domainInfo.count(),
      prisma.domainInfo.count({ where: { is_trending: true } }),
      prisma.domainInfo.count({ where: { is_adult: true } }),
      prisma.domainInfo.count({ where: { is_movie: true } }),
      prisma.domainInfo.aggregate({
        _avg: { monthly_visits: true },
      }),
    ])

    return {
      totalDomains,
      totalTrendingDomains,
      totalAdultDomains,
      totalMovieDomains,
      avgMonthlyVisits: avgVisitsResult._avg.monthly_visits
        ? Number(avgVisitsResult._avg.monthly_visits)
        : null,
    }
  }

  // 批量更新流量查询状态
  static async updateTrafficQueriedStatus(
    domainIds: (string | number | bigint)[],
    status: boolean
  ): Promise<number> {
    const result = await prisma.domainInfo.updateMany({
      where: {
        id: { in: domainIds.map(id => BigInt(id)) },
      },
      data: {
        traffic_queried: status,
      },
    })
    return result.count
  }

  // 批量更新 WHOIS 查询状态
  static async updateWhoisQueriedStatus(
    domainIds: (string | number | bigint)[],
    status: boolean
  ): Promise<number> {
    const result = await prisma.domainInfo.updateMany({
      where: {
        id: { in: domainIds.map(id => BigInt(id)) },
      },
      data: {
        whois_queried: status,
      },
    })
    return result.count
  }
}

/**
 * 获取域名列表（带缓存优化）
 */
export const getDomains = unstable_cache(
  async (options: DomainQueryOptions = {}) => {
    try {
      const {
        page = 1,
        pageSize = 20,
        search = '',
        filters,
        sortBy = 'globalRank',
        sortOrder = 'asc'
      } = options

      // 构建查询条件
      const where: Prisma.DomainInfoWhereInput = {}

    // 搜索条件
    if (search) {
      where.domain = {
        contains: search,
        mode: 'insensitive'
      }
    }

    // 分类筛选
    if (filters?.categories && filters.categories.length > 0) {
      where.category = {
        in: filters.categories
      }
    }

    // 特殊标记筛选
    if (filters?.isAdult !== null && filters?.isAdult !== undefined) {
      where.is_adult = filters.isAdult
    }
    if (filters?.isMovie !== null && filters?.isMovie !== undefined) {
      where.is_movie = filters.isMovie
    }
    if (filters?.isTrending !== null && filters?.isTrending !== undefined) {
      where.is_trending = filters.isTrending
    }

    // TLD筛选
    if (filters?.tld) {
      where.tld = filters.tld
    }

    // 排名范围筛选
    if (filters?.rankRange && filters.rankRange !== 'all') {
      const rankLimits: Record<string, number> = {
        top100: 100,
        top1k: 1000,
        top10k: 10000
      }
      const rankLimit = rankLimits[filters.rankRange]
      if (rankLimit) {
        where.global_rank = {
          lte: rankLimit
        }
      }
    }

    // 执行查询
    const [domains, totalCount] = await Promise.all([
      prisma.domainInfo.findMany({
        where,
        orderBy: {
          [sortBy === 'globalRank' ? 'global_rank' : 
           sortBy === 'monthlyVisits' ? 'monthly_visits' :
           sortBy === 'bounceRate' ? 'bounce_rate' : 'created_at']: sortOrder
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          domain: true,
          tld: true,
          global_rank: true,
          monthly_visits: true,
          bounce_rate: true,
          category: true,
          category_name: true,
          category_rank: true,
          is_adult: true,
          is_movie: true,
          is_trending: true,
          country_code: true,
          title: true,
          description: true,
          domain_status: true,
          traffic_period: true
        }
      }),
      prisma.domainInfo.count({ where })
    ])

    return {
      domains: domains.map(d => ({
        id: d.id.toString(),
        domain: d.domain,
        tld: d.tld,
        globalRank: d.global_rank ? Number(d.global_rank) : null,
        monthlyVisits: d.monthly_visits ? d.monthly_visits.toString() : null,
        bounceRate: d.bounce_rate ? Number(d.bounce_rate) : null,
        category: d.category,
        categoryName: d.category_name,
        categoryRank: d.category_rank,
        isAdult: d.is_adult,
        isMovie: d.is_movie,
        isTrending: d.is_trending,
        countryCode: d.country_code,
        title: d.title,
        description: d.description,
        domainStatus: d.domain_status,
        trafficPeriod: d.traffic_period
      })),
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize)
    }
    } catch (error) {
      console.error('Failed to fetch domains:', error)
      throw new Error('获取域名列表失败')
    }
  },
  ['domains-list'],
  {
    revalidate: 60, // 缓存60秒
    tags: ['domains']
  }
)

/**
 * 获取可用的分类列表
 */
export const getAvailableCategories = unstable_cache(
  async () => {
    try {
      const categories = await prisma.domainInfo.findMany({
        where: {
          category: {
            not: null
          }
        },
        select: {
          category: true
        },
        distinct: ['category']
      })

      return categories
        .map(c => c.category)
        .filter((c): c is string => c !== null)
        .sort()
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      return []
    }
  },
  ['domain-categories'],
  {
    revalidate: 3600, // 缓存1小时
    tags: ['domains']
  }
)

/**
 * 获取可用的TLD列表
 */
export const getAvailableTlds = unstable_cache(
  async () => {
    try {
      const tlds = await prisma.domainInfo.findMany({
        where: {
          tld: {
            not: null
          }
        },
        select: {
          tld: true
        },
        distinct: ['tld']
      })

      return tlds
        .map(t => t.tld)
        .filter((t): t is string => t !== null)
        .sort()
    } catch (error) {
      console.error('Failed to fetch TLDs:', error)
      return []
    }
  },
  ['domain-tlds'],
  {
    revalidate: 3600, // 缓存1小时
    tags: ['domains']
  }
)

/**
 * 获取域名趋势数据
 * TODO: 从时间序列数据库或 monthly_trend 字段获取真实数据
 */
export async function getDomainTrendData(domainId: string, period: '7d' | '30d' | '90d') {
  try {
    const domain = await prisma.domainInfo.findUnique({
      where: { id: BigInt(domainId) },
      select: {
        monthly_trend: true,
        monthly_visits: true,
        bounce_rate: true
      }
    })
    
    if (!domain || !domain.monthly_trend) {
      return []
    }
    
    // 从 monthly_trend 提取数据
    const trendData = domain.monthly_trend as Record<string, number>
    const data = Object.entries(trendData)
      .map(([date, visits]) => ({
        date,
        visits,
        bounceRate: domain.bounce_rate ? Number(domain.bounce_rate) : 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
    
    return data
  } catch (error) {
    console.error('Failed to fetch domain trend data:', error)
    return []
  }
}