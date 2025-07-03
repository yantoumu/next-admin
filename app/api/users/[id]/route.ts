import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { createSuccessResponse, createErrorResponse, APIErrorCode } from '@/lib/api-response'
import { requirePermission, requireAuth } from '@/lib/auth-middleware'
import { updateUserSchema, userIdSchema } from '@/lib/validations/user'
import { APIError, NotFoundError, ForbiddenError } from '@/lib/error-handler'
import { canManageUser } from '@/lib/permissions'

const prisma = new PrismaClient()

/**
 * GET /api/users/[id] - 获取单个用户详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 检查权限：只有admin+可以查看用户详情
    const currentUser = await requirePermission('users.view')
    
    // 获取参数
    const resolvedParams = await params
    
    // 验证用户ID参数
    const { id } = userIdSchema.parse({ id: resolvedParams.id })
    
    // 查询用户
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        created_at: true,
        updated_at: true,
        // 不返回密码字段
      }
    })
    
    if (!user) {
      throw new NotFoundError('用户不存在')
    }
    
    return NextResponse.json(
      createSuccessResponse(user, '用户信息获取成功')
    )
  } catch (error) {
    console.error('API Error:', error)
    
    // 已知的API错误
    if (error instanceof APIError) {
      return NextResponse.json(
        createErrorResponse(error.message, error.statusCode, error.code)
      )
    }
    
    // 未知错误
    return NextResponse.json(
      createErrorResponse('服务器内部错误', 500, APIErrorCode.INTERNAL_ERROR)
    )
  }
}

/**
 * PUT /api/users/[id] - 更新用户信息
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 检查权限：只有admin+可以编辑用户
    const currentUser = await requirePermission('users.edit')
    
    // 获取参数
    const resolvedParams = await params
    
    // 验证用户ID参数
    const { id } = userIdSchema.parse({ id: resolvedParams.id })
    
    // 检查目标用户是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true }
    })
    
    if (!targetUser) {
      throw new NotFoundError('用户不存在')
    }
    
    // 检查是否有权限管理此用户
    if (!canManageUser(currentUser.role, targetUser.role)) {
      throw new ForbiddenError('无权限管理此用户')
    }
    
    const body = await request.json()
    
    // 验证输入数据
    const validatedData = updateUserSchema.parse(body)
    const { name, email, password, role } = validatedData
    
    // 准备更新数据
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (email !== undefined) {
      // 检查邮箱是否已被其他用户使用
      const existingUser = await prisma.user.findFirst({
        where: { 
          email,
          id: { not: id }
        }
      })
      
      if (existingUser) {
        return NextResponse.json(
          createErrorResponse('该邮箱已被其他用户使用', 409, APIErrorCode.VALIDATION_ERROR)
        )
      }
      
      updateData.email = email
    }
    
    if (role !== undefined) {
      // 检查是否有权限设置此角色
      if (!canManageUser(currentUser.role, role)) {
        throw new ForbiddenError('无权限设置此角色')
      }
      updateData.role = role
    }
    
    if (password !== undefined) {
      // 加密新密码
      const salt = crypto.randomBytes(16).toString('hex')
      const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex') + ':' + salt
      updateData.password = hashedPassword
    }
    
    // 更新用户
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        created_at: true,
        updated_at: true,
        // 不返回密码字段
      }
    })
    
    return NextResponse.json(
      createSuccessResponse(updatedUser, '用户信息更新成功')
    )
  } catch (error) {
    console.error('API Error:', error)
    
    // 已知的API错误
    if (error instanceof APIError) {
      return NextResponse.json(
        createErrorResponse(error.message, error.statusCode, error.code)
      )
    }
    
    // 未知错误
    return NextResponse.json(
      createErrorResponse('服务器内部错误', 500, APIErrorCode.INTERNAL_ERROR)
    )
  }
}

/**
 * DELETE /api/users/[id] - 删除用户
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 检查权限：只有admin+可以删除用户
    const currentUser = await requirePermission('users.delete')
    
    // 获取参数
    const resolvedParams = await params
    
    // 验证用户ID参数
    const { id } = userIdSchema.parse({ id: resolvedParams.id })
    
    // 防止用户删除自己
    if (currentUser.id === id) {
      return NextResponse.json(
        createErrorResponse('不能删除自己的账户', 403, APIErrorCode.FORBIDDEN)
      )
    }
    
    // 检查目标用户是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, email: true }
    })
    
    if (!targetUser) {
      throw new NotFoundError('用户不存在')
    }
    
    // 检查是否有权限删除此用户
    if (!canManageUser(currentUser.role, targetUser.role)) {
      throw new ForbiddenError('无权限删除此用户')
    }
    
    // 防止删除最后一个超级管理员
    if (targetUser.role === 'super_admin') {
      const superAdminCount = await prisma.user.count({
        where: { role: 'super_admin' }
      })
      
      if (superAdminCount <= 1) {
        return NextResponse.json(
          createErrorResponse('不能删除最后一个超级管理员', 403, APIErrorCode.FORBIDDEN)
        )
      }
    }
    
    // 删除用户
    await prisma.user.delete({
      where: { id }
    })
    
    return NextResponse.json(
      createSuccessResponse(null, '用户删除成功')
    )
  } catch (error) {
    console.error('API Error:', error)
    
    // 已知的API错误
    if (error instanceof APIError) {
      return NextResponse.json(
        createErrorResponse(error.message, error.statusCode, error.code)
      )
    }
    
    // 未知错误
    return NextResponse.json(
      createErrorResponse('服务器内部错误', 500, APIErrorCode.INTERNAL_ERROR)
    )
  }
}