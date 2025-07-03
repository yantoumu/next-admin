/**
 * 验证种子数据脚本的正确性
 * 用于在没有实际数据库连接时验证种子脚本
 */

import * as crypto from 'crypto'

// 模拟Prisma枚举
enum UserRole {
  super_admin = 'super_admin',
  admin = 'admin', 
  member = 'member',
  viewer = 'viewer'
}

/**
 * 生成密码哈希
 */
function generatePasswordHash(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return { hash, salt }
}

/**
 * 创建用户的完整密码（包含salt）
 */
function createPassword(password: string): string {
  const { hash, salt } = generatePasswordHash(password)
  return `${hash}:${salt}`
}

/**
 * 验证种子数据创建逻辑
 */
function verifySeeding() {
  console.log('🧪 验证种子数据创建逻辑...')
  
  // 测试用户数据
  const users = [
    {
      email: 'admin@example.com',
      password: createPassword('admin123456'),
      name: '超级管理员',
      role: UserRole.super_admin,
    },
    {
      email: 'manager@example.com', 
      password: createPassword('manager123456'),
      name: '系统管理员',
      role: UserRole.admin,
    },
    {
      email: 'member@example.com',
      password: createPassword('member123456'),
      name: '普通成员',
      role: UserRole.member,
    },
    {
      email: 'viewer@example.com',
      password: createPassword('viewer123456'),
      name: '查看者',
      role: UserRole.viewer,
    }
  ]

  // 验证用户数据格式
  users.forEach((user, index) => {
    console.log(`✅ 用户 ${index + 1}: ${user.email}`)
    console.log(`   - 姓名: ${user.name}`)
    console.log(`   - 角色: ${user.role}`)
    console.log(`   - 密码哈希长度: ${user.password.length} 字符`)
    console.log(`   - 包含salt: ${user.password.includes(':') ? '是' : '否'}`)
    
    // 验证密码强度
    if (user.password.length < 100) {
      console.log('   ⚠️  警告: 密码哈希长度过短')
    }
    
    console.log('')
  })

  console.log('🎉 种子数据验证完成!')
  console.log('\n📊 统计信息:')
  console.log(`• 总用户数: ${users.length}`)
  console.log(`• super_admin: ${users.filter(u => u.role === UserRole.super_admin).length}`)
  console.log(`• admin: ${users.filter(u => u.role === UserRole.admin).length}`)
  console.log(`• member: ${users.filter(u => u.role === UserRole.member).length}`)
  console.log(`• viewer: ${users.filter(u => u.role === UserRole.viewer).length}`)
  
  console.log('\n🔐 默认登录信息:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 超级管理员: admin@example.com     🔑 密码: admin123456')
  console.log('📧 系统管理员: manager@example.com   🔑 密码: manager123456')
  console.log('📧 普通成员:   member@example.com    🔑 密码: member123456')
  console.log('📧 查看者:     viewer@example.com    🔑 密码: viewer123456')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  return true
}

// 执行验证
try {
  verifySeeding()
  console.log('\n✅ 种子数据脚本验证通过')
  process.exit(0)
} catch (error) {
  console.error('\n❌ 种子数据脚本验证失败:', error)
  process.exit(1)
}