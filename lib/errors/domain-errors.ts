/**
 * 域名相关的错误类和错误处理
 */

export class DomainError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'DomainError'
  }
}

// 预定义的错误类型
export const DomainErrors = {
  FETCH_FAILED: {
    code: 'DOMAIN_FETCH_FAILED',
    message: 'Failed to fetch domain data',
    userMessage: '获取域名数据失败，请稍后重试',
    statusCode: 500
  },
  INVALID_DOMAIN_ID: {
    code: 'INVALID_DOMAIN_ID',
    message: 'Invalid domain ID provided',
    userMessage: '无效的域名ID',
    statusCode: 400
  },
  DOMAIN_NOT_FOUND: {
    code: 'DOMAIN_NOT_FOUND',
    message: 'Domain not found',
    userMessage: '未找到该域名',
    statusCode: 404
  },
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    message: 'Database operation failed',
    userMessage: '数据库操作失败，请联系管理员',
    statusCode: 500
  },
  PERMISSION_DENIED: {
    code: 'PERMISSION_DENIED',
    message: 'User does not have permission to view domains',
    userMessage: '您没有查看域名的权限',
    statusCode: 403
  },
  INVALID_SORT_PARAMETER: {
    code: 'INVALID_SORT_PARAMETER',
    message: 'Invalid sort parameter provided',
    userMessage: '无效的排序参数',
    statusCode: 400
  }
}

/**
 * 创建域名错误
 */
export function createDomainError(errorType: keyof typeof DomainErrors, customMessage?: string): DomainError {
  const error = DomainErrors[errorType]
  return new DomainError(
    customMessage || error.message,
    error.code,
    error.userMessage,
    error.statusCode
  )
}

/**
 * 处理域名相关错误
 */
export function handleDomainError(error: unknown): {
  message: string
  code: string
  statusCode: number
} {
  // 如果是 DomainError 实例
  if (error instanceof DomainError) {
    return {
      message: error.userMessage,
      code: error.code,
      statusCode: error.statusCode
    }
  }

  // 如果是 Prisma 错误
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any
    
    // 常见的 Prisma 错误码
    switch (prismaError.code) {
      case 'P2002':
        return {
          message: '该域名已存在',
          code: 'DUPLICATE_DOMAIN',
          statusCode: 400
        }
      case 'P2025':
        return {
          message: '未找到相关记录',
          code: 'RECORD_NOT_FOUND',
          statusCode: 404
        }
      case 'P2003':
        return {
          message: '外键约束失败',
          code: 'FOREIGN_KEY_CONSTRAINT',
          statusCode: 400
        }
      default:
        return {
          message: '数据库操作失败',
          code: 'DATABASE_ERROR',
          statusCode: 500
        }
    }
  }

  // 默认错误
  return {
    message: '服务器错误，请稍后重试',
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500
  }
}