#!/usr/bin/env tsx
/**
 * 调试数据库结构脚本
 * 检查domain_info表的具体问题
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugDatabaseStructure() {
  console.log('🔍 调试数据库结构...\n')

  try {
    // 1. 测试基础连接
    console.log('📡 测试数据库连接...')
    await prisma.$connect()
    console.log('✅ 数据库连接成功\n')

    // 2. 尝试查询domain_info表
    console.log('📋 检查domain_info表...')
    try {
      const count = await prisma.domainInfo.count()
      console.log(`✅ domain_info表存在，记录数: ${count}`)
    } catch (error) {
      console.log('❌ domain_info表查询失败:')
      console.log((error as Error).message)
    }

    // 3. 使用原始SQL检查表结构
    console.log('\n🔧 使用原始SQL检查表结构...')
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ` as Array<{table_name: string}>
      
      console.log('📊 现有表:')
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`)
      })

      // 4. 检查domain_info表的列结构
      if (tables.some(t => t.table_name === 'domain_info')) {
        console.log('\n📋 domain_info表列结构:')
        const columns = await prisma.$queryRaw`
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'domain_info' 
          AND table_schema = 'public'
          ORDER BY ordinal_position
        ` as Array<{column_name: string, data_type: string, is_nullable: string}>
        
        console.table(columns)

        // 5. 检查是否缺少特定字段
        const missingFields: string[] = []
        const requiredFields = ['id', 'category_name', 'traffic_paid', 'traffic_mail', 'monthly_trend']
        
        requiredFields.forEach(field => {
          if (!columns.some(col => col.column_name === field)) {
            missingFields.push(field)
          }
        })

        if (missingFields.length > 0) {
          console.log('\n⚠️  缺少的字段:')
          missingFields.forEach(field => {
            console.log(`   - ${field}`)
          })
        } else {
          console.log('\n✅ 所有必需字段都存在')
        }
      } else {
        console.log('\n❌ domain_info表不存在')
      }

    } catch (error) {
      console.log('❌ SQL查询失败:')
      console.log((error as Error).message)
    }

  } catch (error) {
    console.log('❌ 数据库连接失败:')
    console.log((error as Error).message)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 数据库连接已断开')
  }
}

// 运行调试
debugDatabaseStructure().catch(console.error)