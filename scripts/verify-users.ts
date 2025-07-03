import dbConnect from '../lib/db'
import User from '../lib/models/User'
import { UserRole } from '../types/auth'

async function verifyUsers() {
  try {
    console.log('🔍 正在验证数据库中的用户数据...')
    
    await dbConnect()
    console.log('✅ 数据库连接成功')

    // 获取所有用户
    const users = await User.find({}).select('-password').sort({ created_at: 1 })
    
    console.log(`\n📊 数据库统计:`)
    console.log(`   总用户数: ${users.length}`)
    
    // 按角色统计
    const roleStats = {
      'super_admin': 0,
      'admin': 0,
      'member': 0,
      'viewer': 0
    }

    users.forEach(user => {
      roleStats[user.role as UserRole]++
    })

    console.log(`   super_admin: ${roleStats['super_admin']}`)
    console.log(`   admin: ${roleStats['admin']}`)
    console.log(`   member: ${roleStats['member']}`)
    console.log(`   viewer: ${roleStats['viewer']}`)

    console.log(`\n👥 用户列表:`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    users.forEach((user, index) => {
      const roleEmoji = {
        'super_admin': '👑',
        'admin': '🛡️',
        'member': '👤',
        'viewer': '👁️'
      }
      
      console.log(`${index + 1}. ${roleEmoji[user.role as UserRole]} ${user.name || '未设置姓名'}`)
      console.log(`   📧 ${user.email}`)
      console.log(`   🏷️  ${user.role}`)
      console.log(`   📅 创建时间: ${user.created_at.toLocaleString('zh-CN')}`)
      console.log(`   🆔 ID: ${user._id}`)
      console.log('')
    })

    console.log('✅ 用户数据验证完成!')

  } catch (error) {
    console.error('❌ 验证失败:', error)
  } finally {
    const mongoose = require('mongoose')
    await mongoose.connection.close()
    console.log('🔌 数据库连接已关闭')
  }
}

verifyUsers()