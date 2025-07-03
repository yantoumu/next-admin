import { PrismaClient, UserRole } from '@prisma/client'
import * as crypto from 'crypto'

const prisma = new PrismaClient()

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

async function main() {
  console.log('🌱 开始数据库种子数据创建...')

  // 检查是否已存在用户
  const existingUserCount = await prisma.user.count()
  if (existingUserCount > 0) {
    console.log('⚠️  数据库中已存在用户数据，跳过种子数据创建')
    return
  }

  // 准备用户数据
  const usersData = [
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

  // 批量创建用户（逐个创建以避免事务）
  for (const userData of usersData) {
    try {
      const user = await prisma.user.create({
        data: userData
      })
      console.log(`✅ 创建用户: ${user.email} (${userData.name})`)
    } catch (error) {
      console.error(`❌ 创建用户失败: ${userData.email}`, error)
    }
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
}

main()
  .catch((e) => {
    console.error('❌ 种子数据创建失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })