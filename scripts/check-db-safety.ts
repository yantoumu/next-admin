import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// 加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// 检查环境变量
if (!process.env.DATABASE_URL) {
  console.error('❌ 错误: DATABASE_URL 环境变量未设置')
  console.log('请确保 .env 文件存在并包含 DATABASE_URL')
  process.exit(1)
}

const prisma = new PrismaClient()

/**
 * 检查数据库安全性脚本
 * 在执行任何迁移前运行此脚本
 */
async function checkDatabaseSafety() {
  console.log('🔍 开始数据库安全检查...\n')

  try {
    // 1. 检查是否已存在 tasks 表
    const tasksTableExists = await prisma.$queryRaw<any[]>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'tasks'
    `
    
    if (tasksTableExists.length > 0) {
      console.log('⚠️  警告: tasks 表已存在！')
      console.log('   请检查是否为同一个表结构，避免冲突。\n')
    } else {
      console.log('✅ tasks 表不存在，可以安全创建。\n')
    }

    // 2. 检查是否已存在枚举类型
    const enumTypes = await prisma.$queryRaw<any[]>`
      SELECT typname 
      FROM pg_type 
      WHERE typname IN ('TaskStatus', 'TaskPriority')
      AND typtype = 'e'
    `
    
    if (enumTypes.length > 0) {
      console.log('⚠️  警告: 发现已存在的枚举类型:')
      enumTypes.forEach(e => console.log(`   - ${e.typname}`))
      console.log('   请确认是否为相同定义。\n')
    } else {
      console.log('✅ 枚举类型不存在，可以安全创建。\n')
    }

    // 3. 检查 users 表的当前结构
    console.log('📋 当前 users 表结构:')
    const userColumns = await prisma.$queryRaw<any[]>`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `
    
    console.table(userColumns.map(col => ({
      列名: col.column_name,
      数据类型: col.data_type,
      可为空: col.is_nullable
    })))

    // 4. 检查现有数据量
    const userCount = await prisma.user.count()
    const domainCount = await prisma.domainInfo.count().catch(() => 0)
    
    console.log('\n📊 现有数据统计:')
    console.log(`   - 用户数量: ${userCount}`)
    console.log(`   - 域名数量: ${domainCount}`)

    // 5. 生成建议
    console.log('\n💡 建议:')
    console.log('1. 在执行迁移前，请先备份数据库')
    console.log('2. 使用提供的 manual_add_tasks.sql 脚本手动执行')
    console.log('3. 先在测试环境验证')
    console.log('4. 确保有回滚方案')

    console.log('\n✅ 安全检查完成！')
    
  } catch (error) {
    console.error('❌ 检查过程中出错:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 执行检查
checkDatabaseSafety().catch(console.error)