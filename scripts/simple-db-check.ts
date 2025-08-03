import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// 加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

async function checkDatabase() {
  console.log('🔍 检查数据库表...\n')

  try {
    // 检查现有表
    const tables = await prisma.$queryRaw<any[]>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `
    
    console.log('📋 现有表:')
    tables.forEach(t => console.log(`   - ${t.table_name}`))
    
    // 检查是否有 tasks 表
    const hasTasksTable = tables.some(t => t.table_name === 'tasks')
    
    if (hasTasksTable) {
      console.log('\n⚠️  警告: tasks 表已存在！')
    } else {
      console.log('\n✅ 安全: tasks 表不存在，可以创建')
    }

    // 显示简单统计
    console.log('\n📊 数据统计:')
    const userCount = await prisma.user.count()
    console.log(`   - users 表: ${userCount} 条记录`)
    
    try {
      const domainCount = await prisma.domainInfo.count()
      console.log(`   - domain_info 表: ${domainCount} 条记录`)
    } catch (e) {
      console.log(`   - domain_info 表: 无法访问`)
    }

    console.log('\n✅ 检查完成！')
    console.log('\n💡 建议:')
    console.log('1. 新增的 tasks 表不会影响现有的 3 张表')
    console.log('2. 建议先备份数据库: pg_dump -U user -h host -d database > backup.sql')
    console.log('3. 执行迁移: psql -U user -h host -d database < prisma/migrations/manual_add_tasks.sql')
    
  } catch (error) {
    console.error('❌ 错误:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()