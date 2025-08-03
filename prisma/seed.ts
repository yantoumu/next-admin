import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * 创建bcrypt密码哈希
 */
async function createPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
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
      password: await createPassword('admin123456'),
      name: '超级管理员',
      role: UserRole.super_admin,
    },
    {
      email: 'manager@example.com',
      password: await createPassword('manager123456'),
      name: '系统管理员',
      role: UserRole.admin,
    },
    {
      email: 'member@example.com',
      password: await createPassword('member123456'),
      name: '普通成员',
      role: UserRole.member,
    },
    {
      email: 'viewer@example.com',
      password: await createPassword('viewer123456'),
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

  // 创建域名测试数据
  console.log('\n🌐 创建域名测试数据...')
  
  const domainTestData = [
    {
      domain: 'tw.live',
      tld: 'live',
      registrar: 'Cloudflare, Inc',
      nameservers: ['cass.ns.cloudflare.com', 'lex.ns.cloudflare.com'],
      global_rank: 50000,
      monthly_visits: BigInt(1200000),
      bounce_rate: 25.5,
      pages_per_visit: 3.2,
      avg_visit_duration: 125,
      traffic_direct: 35.5,
      traffic_search: 40.2,
      traffic_social: 15.3,
      traffic_referral: 9.0,
      category: 'vehicles/vehicles',
      is_adult: false,
      is_movie: true,
      is_trending: true,
      country_code: 'CN',
      country_rank: 156,
      registration_date: new Date('2024-01-15'),
      traffic_queried: true,
      whois_queried: true,
    },
    {
      domain: 'tech.ai',
      tld: 'ai',
      registrar: 'Namecheap, Inc',
      nameservers: ['ns1.namecheap.com', 'ns2.namecheap.com'],
      global_rank: 12000,
      monthly_visits: BigInt(5800000),
      bounce_rate: 32.1,
      pages_per_visit: 4.5,
      avg_visit_duration: 240,
      traffic_direct: 45.0,
      traffic_search: 35.0,
      traffic_social: 12.0,
      traffic_referral: 8.0,
      category: 'technology/ai',
      is_adult: false,
      is_movie: false,
      is_trending: true,
      country_code: 'US',
      country_rank: 89,
      registration_date: new Date('2023-12-20'),
      traffic_queried: true,
      whois_queried: true,
    },
    {
      domain: 'news.today',
      tld: 'today',
      registrar: 'GoDaddy.com, LLC',
      nameservers: ['ns1.godaddy.com', 'ns2.godaddy.com'],
      global_rank: 25000,
      monthly_visits: BigInt(890000),
      bounce_rate: 45.2,
      pages_per_visit: 2.8,
      avg_visit_duration: 95,
      traffic_direct: 28.5,
      traffic_search: 55.2,
      traffic_social: 10.3,
      traffic_referral: 6.0,
      category: 'news/general',
      is_adult: false,
      is_movie: false,
      is_trending: false,
      country_code: 'UK',
      country_rank: 234,
      registration_date: new Date('2024-02-01'),
      traffic_queried: true,
      whois_queried: false,
    },
    {
      domain: 'shop.store',
      tld: 'store',
      registrar: 'Google Domains',
      nameservers: ['ns-cloud-a1.googledomains.com'],
      global_rank: 8500,
      monthly_visits: BigInt(2300000),
      bounce_rate: 38.7,
      pages_per_visit: 5.2,
      avg_visit_duration: 320,
      traffic_direct: 52.0,
      traffic_search: 25.0,
      traffic_social: 18.0,
      traffic_referral: 5.0,
      category: 'e-commerce/retail',
      is_adult: false,
      is_movie: false,
      is_trending: true,
      country_code: 'US',
      country_rank: 67,
      registration_date: new Date('2023-11-08'),
      traffic_queried: true,
      whois_queried: true,
    },
    {
      domain: 'game.fun',
      tld: 'fun',
      registrar: 'Porkbun LLC',
      nameservers: ['ns1.porkbun.com', 'ns2.porkbun.com'],
      global_rank: 15000,
      monthly_visits: BigInt(3200000),
      bounce_rate: 22.3,
      pages_per_visit: 6.8,
      avg_visit_duration: 480,
      traffic_direct: 65.0,
      traffic_search: 20.0,
      traffic_social: 10.0,
      traffic_referral: 5.0,
      category: 'games/online',
      is_adult: false,
      is_movie: false,
      is_trending: true,
      country_code: 'JP',
      country_rank: 45,
      registration_date: new Date('2023-10-15'),
      traffic_queried: true,
      whois_queried: true,
    },
  ]

  // 创建域名数据
  for (const domainData of domainTestData) {
    try {
      const domain = await prisma.domainInfo.create({
        data: domainData
      })
      console.log(`✅ 创建域名: ${domain.domain}`)
    } catch (error) {
      console.error(`❌ 创建域名失败: ${domainData.domain}`, error)
    }
  }

  console.log('\n🎉 域名测试数据创建完成!')
}

main()
  .catch((e) => {
    console.error('❌ 种子数据创建失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })