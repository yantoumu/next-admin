import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'

/**
 * POST /api/seed - 初始化数据库数据
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    // 检查是否已有用户数据
    const existingUsers = await User.countDocuments()
    if (existingUsers > 0) {
      return NextResponse.json({
        success: true,
        message: `数据库已有 ${existingUsers} 个用户，无需重复初始化`
      })
    }

    // 创建密码哈希函数
    const createPassword = async (password: string) => {
      return await bcrypt.hash(password, 12)
    }

    // 创建默认用户
    const defaultUsers = [
      {
        email: 'admin@example.com',
        password: await createPassword('admin123456'),
        name: '超级管理员',
        role: 'super_admin',
      },
      {
        email: 'manager@example.com',
        password: await createPassword('manager123456'),
        name: '系统管理员',
        role: 'admin',
      },
      {
        email: 'member@example.com',
        password: await createPassword('member123456'),
        name: '普通成员',
        role: 'member',
      },
      {
        email: 'viewer@example.com',
        password: await createPassword('viewer123456'),
        name: '访客用户',
        role: 'viewer',
      }
    ]

    // 批量插入用户
    const createdUsers = await User.insertMany(defaultUsers)
    
    console.log(`✅ 成功创建 ${createdUsers.length} 个默认用户`)
    
    return NextResponse.json({
      success: true,
      message: `成功创建 ${createdUsers.length} 个默认用户`,
      users: createdUsers.map(user => ({
        email: user.email,
        name: user.name,
        role: user.role
      }))
    })
    
  } catch (error) {
    console.error('数据库初始化失败:', error)
    return NextResponse.json({
      success: false,
      error: '数据库初始化失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

/**
 * GET /api/seed - 检查数据库状态
 */
export async function GET() {
  try {
    await dbConnect()
    
    const userCount = await User.countDocuments()
    const users = await User.find({}, 'email name role created_at').limit(10)
    
    return NextResponse.json({
      success: true,
      userCount,
      users: users.map(user => ({
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at
      }))
    })
    
  } catch (error) {
    console.error('检查数据库状态失败:', error)
    return NextResponse.json({
      success: false,
      error: '检查数据库状态失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}
