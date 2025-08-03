#!/usr/bin/env tsx
/**
 * 应用 domain_info 表修复
 * 添加缺失的主键字段
 */

import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function applyDomainInfoFix() {
  console.log('🔧 开始修复 domain_info 表...\n')

  try {
    // 1. 读取SQL修复脚本
    const sqlFile = path.join(__dirname, 'fix-domain-info-table.sql')
    const sqlScript = readFileSync(sqlFile, 'utf-8')

    console.log('📋 执行修复脚本...')
    
    // 2. 分步执行SQL命令
    const commands = sqlScript
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--') && cmd !== 'BEGIN' && cmd !== 'COMMIT')

    for (const command of commands) {
      if (command.includes('ALTER TABLE') || command.includes('UPDATE') || command.includes('CREATE INDEX')) {
        console.log(`   执行: ${command.substring(0, 50)}...`)
        await prisma.$executeRawUnsafe(command)
      } else if (command.includes('SELECT')) {
        console.log('   验证修复结果...')
        const result = await prisma.$queryRawUnsafe(command) as any[]
        console.table(result)
      }
    }

    // 3. 测试 Prisma 查询
    console.log('\n✅ 测试 Prisma 查询...')
    const count = await prisma.domainInfo.count()
    console.log(`   domain_info 表记录数: ${count}`)

    // 4. 重新生成 Prisma 客户端
    console.log('\n🔄 重新生成 Prisma 客户端...')
    const { exec } = require('child_process')
    await new Promise((resolve, reject) => {
      exec('npx prisma generate', (error: any, stdout: any, stderr: any) => {
        if (error) {
          reject(error)
        } else {
          console.log('   ✅ Prisma 客户端已更新')
          resolve(stdout)
        }
      })
    })

    console.log('\n🎉 修复完成！')
    console.log('\n💡 建议接下来：')
    console.log('   1. 重启开发服务器: npm run dev')
    console.log('   2. 测试域名管理功能')
    console.log('   3. 检查API端点是否正常工作')

  } catch (error) {
    console.log('\n❌ 修复失败:')
    console.log((error as Error).message)
    console.log('\n🔄 请检查数据库连接和权限')
  } finally {
    await prisma.$disconnect()
  }
}

// 运行修复
applyDomainInfoFix().catch(console.error)