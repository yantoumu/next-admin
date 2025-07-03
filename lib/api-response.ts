import { NextResponse } from 'next/server'

/**
 * 标准API响应接口
 */
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: string
}

/**
 * 分页响应接口
 */
export interface PaginatedResponse<T = any> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  message?: string
}

/**
 * API错误类型
 */
export enum APIErrorCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR'
}

/**
 * 成功响应构造器
 */
export function createSuccessResponse<T>(
  data?: T, 
  message?: string,
  status: number = 200
): NextResponse<APIResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message: message || 'Success'
    },
    { status }
  )
}

/**
 * 错误响应构造器
 */
export function createErrorResponse(
  error: string,
  status: number = 400,
  code?: APIErrorCode
): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      code: code || APIErrorCode.INVALID_REQUEST
    },
    { status }
  )
}

/**
 * 分页响应构造器
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit)
  
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    message: message || 'Success'
  })
}

/**
 * 验证错误响应
 */
export function createValidationErrorResponse(
  errors: Record<string, string>
): NextResponse<APIResponse> {
  return createErrorResponse(
    'Validation failed',
    422,
    APIErrorCode.VALIDATION_ERROR
  )
}

/**
 * 权限不足响应
 */
export function createUnauthorizedResponse(
  message: string = 'Unauthorized access'
): NextResponse<APIResponse> {
  return createErrorResponse(
    message,
    401,
    APIErrorCode.UNAUTHORIZED
  )
}

/**
 * 禁止访问响应
 */
export function createForbiddenResponse(
  message: string = 'Access forbidden'
): NextResponse<APIResponse> {
  return createErrorResponse(
    message,
    403,
    APIErrorCode.FORBIDDEN
  )
}

/**
 * 资源未找到响应
 */
export function createNotFoundResponse(
  message: string = 'Resource not found'
): NextResponse<APIResponse> {
  return createErrorResponse(
    message,
    404,
    APIErrorCode.NOT_FOUND
  )
}

/**
 * 服务器错误响应
 */
export function createInternalErrorResponse(
  message: string = 'Internal server error'
): NextResponse<APIResponse> {
  return createErrorResponse(
    message,
    500,
    APIErrorCode.INTERNAL_ERROR
  )
}