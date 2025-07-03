import { NextRequest, NextResponse } from 'next/server'
import { createErrorResponse, createInternalErrorResponse, APIErrorCode } from './api-response'

/**
 * API错误类
 */
export class APIError extends Error {
  public readonly statusCode: number
  public readonly code: APIErrorCode
  public readonly details?: any

  constructor(
    message: string,
    statusCode: number = 400,
    code: APIErrorCode = APIErrorCode.INVALID_REQUEST,
    details?: any
  ) {
    super(message)
    this.name = 'APIError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

/**
 * 验证错误类
 */
export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 422, APIErrorCode.VALIDATION_ERROR, details)
    this.name = 'ValidationError'
  }
}

/**
 * 认证错误类
 */
export class UnauthorizedError extends APIError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, APIErrorCode.UNAUTHORIZED)
    this.name = 'UnauthorizedError'
  }
}

/**
 * 权限错误类
 */
export class ForbiddenError extends APIError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, APIErrorCode.FORBIDDEN)
    this.name = 'ForbiddenError'
  }
}

/**
 * 资源未找到错误类
 */
export class NotFoundError extends APIError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, APIErrorCode.NOT_FOUND)
    this.name = 'NotFoundError'
  }
}

/**
 * 数据库错误类
 */
export class DatabaseError extends APIError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, APIErrorCode.DATABASE_ERROR)
    this.name = 'DatabaseError'
  }
}

/**
 * API错误处理中间件类型
 */
export type APIHandler = (req: NextRequest) => Promise<NextResponse>

/**
 * 错误处理包装器
 */
export function withErrorHandler(handler: APIHandler): APIHandler {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req)
    } catch (error) {
      console.error('API Error:', error)
      
      // 已知的API错误
      if (error instanceof APIError) {
        return createErrorResponse(
          error.message,
          error.statusCode,
          error.code
        )
      }
      
      // 未知错误
      if (error instanceof Error) {
        return createInternalErrorResponse(
          process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'Internal server error'
        )
      }
      
      // 其他情况
      return createInternalErrorResponse()
    }
  }
}

/**
 * 权限检查装饰器
 */
export function requirePermission(permission: string) {
  return function(handler: APIHandler): APIHandler {
    return withErrorHandler(async (req: NextRequest) => {
      // TODO: 实现权限检查逻辑
      // const user = await getCurrentUserFromRequest(req)
      // if (!hasPermission(user.role, permission)) {
      //   throw new ForbiddenError('Insufficient permissions')
      // }
      
      return handler(req)
    })
  }
}

/**
 * 认证检查装饰器
 */
export function requireAuth(handler: APIHandler): APIHandler {
  return withErrorHandler(async (req: NextRequest) => {
    // TODO: 实现认证检查逻辑
    // const user = await getCurrentUserFromRequest(req)
    // if (!user) {
    //   throw new UnauthorizedError('Authentication required')
    // }
    
    return handler(req)
  })
}

/**
 * 输入验证装饰器
 */
export function validateInput<T>(
  schema: (data: any) => T,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>
): APIHandler {
  return withErrorHandler(async (req: NextRequest) => {
    try {
      const body = await req.json().catch(() => ({}))
      const validatedData = schema(body)
      return handler(req, validatedData)
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(`Invalid input: ${error.message}`)
      }
      throw new ValidationError('Invalid input data')
    }
  })
}

/**
 * 速率限制装饰器
 */
export function rateLimit(
  maxRequests: number = 100,
  windowMs: number = 60000
) {
  const requests = new Map<string, { count: number; resetTime: number }>()
  
  return function(handler: APIHandler): APIHandler {
    return withErrorHandler(async (req: NextRequest) => {
      const clientId = req.headers.get('x-forwarded-for') || 'unknown'
      const now = Date.now()
      
      const clientData = requests.get(clientId)
      
      if (!clientData || now > clientData.resetTime) {
        requests.set(clientId, {
          count: 1,
          resetTime: now + windowMs
        })
      } else {
        clientData.count++
        
        if (clientData.count > maxRequests) {
          throw new APIError(
            'Rate limit exceeded',
            429,
            APIErrorCode.INVALID_REQUEST
          )
        }
      }
      
      return handler(req)
    })
  }
}