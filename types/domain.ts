// 域名相关的类型定义

export interface TopKeyword {
  keyword: string
  volume: number
  traffic?: number
  cpc?: string
}

export interface TopCountry {
  code: string
  percentage: number
}

export interface DomainData {
  id: string
  domain: string
  title?: string | null
  description?: string | null
  tld?: string | null
  
  // 流量数据
  monthlyVisits?: string | null
  globalRank?: number | null
  bounceRate?: number | null
  avg_duration?: string | null
  
  // 分类信息
  category?: string | null
  categoryName?: string | null
  categoryRank?: number | null
  
  // 标记
  isAdult?: boolean | null
  isMovie?: boolean | null
  isTrending?: boolean | null
  
  // 地理信息
  countryCode?: string | null
  topCountries?: TopCountry[] | null
  
  // 关键词
  topKeywords?: TopKeyword[] | null
  
  // 状态
  domainStatus?: string[] | null
  trafficPeriod?: string | null
  
  // 日期
  registrationDate?: Date | string | null
  created_at?: Date | string | null
  updated_at?: Date | string | null
  
  // 流量来源
  traffic_sources?: any
  
  // 增长数据
  growthRate?: number      // 增长率（百分比）
  growthVolume?: number    // 增长量
}

export interface DomainListResponse {
  domains: DomainData[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface DomainQueryOptions {
  page?: number
  pageSize?: number
  search?: string
  filters?: any
  sortBy?: 'globalRank' | 'monthlyVisits' | 'bounceRate' | 'createdAt' | 'registrationDate'
  sortOrder?: 'asc' | 'desc'
  sort?: string  // Traffic.cv 风格的排序参数
}