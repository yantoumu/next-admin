import dbConnect from '../lib/db'
import User, { UserRole } from '../lib/models/User'
import bcrypt from 'bcryptjs'

/**
 * 创建用户的完整密码（使用bcrypt）
 */
async function createPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

async function seedDatabase() {
  try {
    console.log('🌱 开始 MongoDB 种子数据创建...')
    
    // 连接数据库
    await dbConnect()
    console.log('✅ 数据库连接成功')

    // 检查是否已存在用户
    const existingUserCount = await User.countDocuments()
    if (existingUserCount > 0) {
      console.log('⚠️  数据库中已存在用户数据，跳过种子数据创建')
      console.log(`📊 当前用户数量: ${existingUserCount}`)
      return
    }

    // 准备用户种子数据
    const usersData = [
      {
        email: 'admin@example.com',
        password: await createPassword('admin123456'),
        name: '超级管理员',
        role: UserRole.SUPER_ADMIN,
      },
      {
        email: 'manager@example.com',
        password: await createPassword('manager123456'),
        name: '系统管理员',
        role: UserRole.ADMIN,
      },
      {
        email: 'member@example.com',
        password: await createPassword('member123456'),
        name: '普通成员',
        role: UserRole.MEMBER,
      },
      {
        email: 'viewer@example.com',
        password: await createPassword('viewer123456'),
        name: '查看者',
        role: UserRole.VIEWER,
      }
    ]

    console.log('📝 正在创建用户...')

    // 批量插入用户数据
    const createdUsers = await User.insertMany(usersData, { ordered: false })
    
    console.log(`✅ 成功创建 ${createdUsers.length} 个用户`)
    
    // 显示创建的用户信息
    for (const user of createdUsers) {
      console.log(`   📧 ${user.email} - ${user.name} (${user.role})`)
    }

    console.log('\n🎉 数据库种子数据创建完成!')
    console.log('\n👤 默认用户账号:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 超级管理员: admin@example.com     🔑 密码: admin123456')
    console.log('📧 系统管理员: manager@example.com   🔑 密码: manager123456')
    console.log('📧 普通成员:   member@example.com    🔑 密码: member123456')
    console.log('📧 查看者:     viewer@example.com    🔑 密码: viewer123456')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    console.log('\n🔐 角色权限说明:')
    console.log('• super_admin: 所有权限，包括用户管理、系统设置')
    console.log('• admin: 用户管理权限，部分系统设置查看')
    console.log('• member: 基本仪表板访问权限')
    console.log('• viewer: 只读访问权限')

  } catch (error) {
    console.error('❌ 种子数据创建失败:', error)
    process.exit(1)
  } finally {
    // 关闭数据库连接
    const mongoose = require('mongoose')
    await mongoose.connection.close()
    console.log('\n🔌 数据库连接已关闭')
  }
}

// 执行种子数据创建
seedDatabase()