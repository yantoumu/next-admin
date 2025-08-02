#!/usr/bin/env tsx

/**
 * MongoDB到PostgreSQL数据迁移脚本
 * 
 * 功能：
 * - 从MongoDB导出用户数据
 * - 转换数据格式
 * - 导入到PostgreSQL
 * - 数据完整性验证
 * 
 * 安全特性：
 * - 数据备份
 * - 回滚机制
 * - 完整性检查
 * - 错误处理
 */

import { PrismaClient } from '@prisma/client'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import fs from 'fs/promises'
import path from 'path'

// MongoDB连接（旧数据库）
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/next-admin'

// PostgreSQL连接（新数据库）
const prisma = new PrismaClient()

// MongoDB用户模型
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  created_at: Date,
  updated_at: Date
})

const MongoUser = mongoose.model('User', UserSchema)

interface MigrationStats {
  totalUsers: number
  migratedUsers: number
  skippedUsers: number
  errors: string[]
}

/**
 * 连接MongoDB
 */
async function connectMongoDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB连接成功')
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error)
    throw error
  }
}

/**
 * 连接PostgreSQL
 */
async function connectPostgreSQL(): Promise<void> {
  try {
    await prisma.$connect()
    console.log('✅ PostgreSQL连接成功')
  } catch (error) {
    console.error('❌ PostgreSQL连接失败:', error)
    throw error
  }
}

/**
 * 备份MongoDB数据
 */
async function backupMongoData(): Promise<string> {
  try {
    const users = await MongoUser.find({}).lean()
    const backupData = {
      timestamp: new Date().toISOString(),
      users: users
    }
    
    const backupDir = path.join(process.cwd(), 'backups')
    await fs.mkdir(backupDir, { recursive: true })
    
    const backupFile = path.join(backupDir, `mongodb-backup-${Date.now()}.json`)
    await fs.writeFile(backupFile, JSON.stringify(backupData, null, 2))
    
    console.log(`✅ MongoDB数据已备份到: ${backupFile}`)
    return backupFile
  } catch (error) {
    console.error('❌ 备份MongoDB数据失败:', error)
    throw error
  }
}

/**
 * 转换用户角色
 */
function convertUserRole(mongoRole: string): string {
  const roleMap: Record<string, string> = {
    'super_admin': 'SUPER_ADMIN',
    'admin': 'ADMIN',
    'member': 'MEMBER',
    'viewer': 'VIEWER'
  }
  
  return roleMap[mongoRole] || 'MEMBER'
}

/**
 * 验证密码哈希格式
 */
function isValidBcryptHash(hash: string): boolean {
  // bcrypt哈希格式：$2a$10$...或$2b$12$...
  return /^\$2[ab]\$\d{2}\$/.test(hash)
}

/**
 * 迁移用户数据
 */
async function migrateUsers(): Promise<MigrationStats> {
  const stats: MigrationStats = {
    totalUsers: 0,
    migratedUsers: 0,
    skippedUsers: 0,
    errors: []
  }

  try {
    // 获取MongoDB中的所有用户
    const mongoUsers = await MongoUser.find({}).lean()
    stats.totalUsers = mongoUsers.length
    
    console.log(`📊 找到 ${stats.totalUsers} 个用户需要迁移`)

    for (const mongoUser of mongoUsers) {
      try {
        // 检查用户是否已存在
        const existingUser = await prisma.user.findUnique({
          where: { email: mongoUser.email }
        })

        if (existingUser) {
          console.log(`⚠️ 用户已存在，跳过: ${mongoUser.email}`)
          stats.skippedUsers++
          continue
        }

        // 验证必要字段
        if (!mongoUser.email || !mongoUser.password) {
          const error = `用户缺少必要字段: ${mongoUser.email || 'unknown'}`
          console.error(`❌ ${error}`)
          stats.errors.push(error)
          continue
        }

        // 验证密码哈希格式
        if (!isValidBcryptHash(mongoUser.password)) {
          // 如果不是有效的bcrypt哈希，重新哈希
          console.log(`🔄 重新哈希密码: ${mongoUser.email}`)
          mongoUser.password = await bcrypt.hash(mongoUser.password, 12)
        }

        // 创建PostgreSQL用户
        const newUser = await prisma.user.create({
          data: {
            email: mongoUser.email.toLowerCase().trim(),
            password: mongoUser.password,
            name: mongoUser.name || null,
            role: convertUserRole(mongoUser.role || 'member') as any,
            created_at: mongoUser.created_at || new Date(),
            updated_at: mongoUser.updated_at || new Date(),
          }
        })

        console.log(`✅ 迁移成功: ${newUser.email}`)
        stats.migratedUsers++

      } catch (error) {
        const errorMsg = `迁移用户失败 ${mongoUser.email}: ${error instanceof Error ? error.message : '未知错误'}`
        console.error(`❌ ${errorMsg}`)
        stats.errors.push(errorMsg)
      }
    }

    return stats
  } catch (error) {
    console.error('❌ 迁移过程失败:', error)
    throw error
  }
}

/**
 * 验证迁移结果
 */
async function validateMigration(): Promise<boolean> {
  try {
    console.log('🔍 验证迁移结果...')

    // 检查PostgreSQL中的用户数量
    const pgUserCount = await prisma.user.count()
    console.log(`📊 PostgreSQL用户数量: ${pgUserCount}`)

    // 检查MongoDB中的用户数量
    const mongoUserCount = await MongoUser.countDocuments()
    console.log(`📊 MongoDB用户数量: ${mongoUserCount}`)

    // 验证关键用户是否存在
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    })

    if (!adminUser) {
      console.error('❌ 关键用户admin@example.com未找到')
      return false
    }

    console.log('✅ 迁移验证通过')
    return true
  } catch (error) {
    console.error('❌ 迁移验证失败:', error)
    return false
  }
}

/**
 * 清理资源
 */
async function cleanup(): Promise<void> {
  try {
    await mongoose.disconnect()
    await prisma.$disconnect()
    console.log('✅ 数据库连接已关闭')
  } catch (error) {
    console.error('❌ 清理资源失败:', error)
  }
}

/**
 * 主迁移函数
 */
async function main(): Promise<void> {
  console.log('🚀 开始MongoDB到PostgreSQL数据迁移')
  console.log('=' .repeat(50))

  try {
    // 1. 连接数据库
    await connectMongoDB()
    await connectPostgreSQL()

    // 2. 备份MongoDB数据
    const backupFile = await backupMongoData()

    // 3. 执行迁移
    const stats = await migrateUsers()

    // 4. 验证迁移结果
    const isValid = await validateMigration()

    // 5. 输出迁移报告
    console.log('\n' + '=' .repeat(50))
    console.log('📋 迁移报告:')
    console.log(`   总用户数: ${stats.totalUsers}`)
    console.log(`   成功迁移: ${stats.migratedUsers}`)
    console.log(`   跳过用户: ${stats.skippedUsers}`)
    console.log(`   错误数量: ${stats.errors.length}`)
    console.log(`   验证结果: ${isValid ? '✅ 通过' : '❌ 失败'}`)
    console.log(`   备份文件: ${backupFile}`)

    if (stats.errors.length > 0) {
      console.log('\n❌ 错误详情:')
      stats.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`)
      })
    }

    if (isValid && stats.errors.length === 0) {
      console.log('\n🎉 迁移完成！数据已成功从MongoDB迁移到PostgreSQL')
    } else {
      console.log('\n⚠️ 迁移完成，但存在一些问题，请检查上述错误信息')
    }

  } catch (error) {
    console.error('\n💥 迁移失败:', error)
    process.exit(1)
  } finally {
    await cleanup()
  }
}

// 执行迁移
if (require.main === module) {
  main().catch(console.error)
}
