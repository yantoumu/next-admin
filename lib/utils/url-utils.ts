/**
 * URL和查询参数处理工具
 */
export const urlUtils = {
  /**
   * 构建URL查询参数
   */
  buildQueryString(params: Record<string, any>): string {
    const urlParams = new URLSearchParams()
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== '') {
        urlParams.append(key, String(value))
      }
    }
    
    return urlParams.toString()
  },

  /**
   * 解析URL查询参数
   */
  parseQueryString(queryString: string): Record<string, string> {
    const params: Record<string, string> = {}
    const urlParams = new URLSearchParams(queryString)
    
    for (const [key, value] of urlParams) {
      params[key] = value
    }
    
    return params
  },

  /**
   * 获取URL的基础路径
   */
  getBasePath(url: string): string {
    try {
      const urlObj = new URL(url)
      return urlObj.origin + urlObj.pathname
    } catch {
      return url.split('?')[0].split('#')[0]
    }
  },

  /**
   * 获取URL域名
   */
  getDomain(url: string): string {
    try {
      return new URL(url).hostname
    } catch {
      return ''
    }
  },

  /**
   * 检查URL是否有效
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  /**
   * 组合URL路径
   */
  joinPaths(...paths: string[]): string {
    return paths
      .map(path => path.replace(/^\/+|\/+$/g, ''))
      .filter(path => path.length > 0)
      .join('/')
  },

  /**
   * 为URL添加查询参数
   */
  addQueryParams(url: string, params: Record<string, any>): string {
    const queryString = this.buildQueryString(params)
    if (!queryString) return url
    
    const separator = url.includes('?') ? '&' : '?'
    return url + separator + queryString
  },

  /**
   * 从URL中移除查询参数
   */
  removeQueryParams(url: string, paramsToRemove: string[]): string {
    try {
      const urlObj = new URL(url)
      for (const param of paramsToRemove) {
        urlObj.searchParams.delete(param)
      }
      return urlObj.toString()
    } catch {
      return url
    }
  },

  /**
   * 获取URL路径段
   */
  getPathSegments(url: string): string[] {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname.split('/').filter(segment => segment.length > 0)
    } catch {
      const path = url.split('?')[0].split('#')[0]
      return path.split('/').filter(segment => segment.length > 0)
    }
  },

  /**
   * 检查是否为外部链接
   */
  isExternalUrl(url: string, currentDomain?: string): boolean {
    if (!this.isValidUrl(url)) return false
    
    const domain = currentDomain || (typeof window !== 'undefined' ? window.location.hostname : '')
    return this.getDomain(url) !== domain
  }
}