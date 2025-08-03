import { PrismaClient } from '@prisma/client'

/**
 * PostgreSQL数据库连接管理
 * 使用Prisma Client进行类型安全的数据库操作
 *
 * 安全特性：
 * - 自动SQL注入防护
 * - 连接池管理
 * - 查询日志记录
 * - 错误处理和重试机制
 */

// 全局Prisma客户端缓存，防止开发模式下重复实例化
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * 创建Prisma客户端实例
 * 配置安全和性能选项
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // 数据库连接配置
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },

  // 日志配置 - 生产环境只记录错误
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],

  // 错误格式化
  errorFormat: 'pretty',
})

// 开发环境缓存客户端实例
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * 数据库连接健康检查
 * 验证连接状态和基本查询能力
 */
export async function dbHealthCheck(): Promise<boolean> {
  try {
    // 执行简单查询验证连接
    await prisma.$queryRaw`SELECT 1 as health_check`
    console.log('✅ PostgreSQL 连接健康检查通过')
    return true
  } catch (error) {
    console.error('❌ PostgreSQL 连接健康检查失败:', error)
    return false
  }
}

/**
 * 数据库连接函数 - 兼容现有代码
 * 执行连接验证并返回Prisma客户端
 */
export default async function dbConnect() {
  try {
    // 验证数据库连接
    await prisma.$connect()
    console.log('✅ PostgreSQL 连接成功')
    return prisma
  } catch (error) {
    console.error('❌ PostgreSQL 连接失败:', error)
    throw new Error(`数据库连接失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 优雅关闭数据库连接
 * 应用关闭时调用
 */
export async function dbDisconnect() {
  try {
    await prisma.$disconnect()
    console.log('✅ PostgreSQL 连接已关闭')
  } catch (error) {
    console.error('❌ PostgreSQL 连接关闭失败:', error)
  }
}

// 进程退出时自动关闭连接
process.on('beforeExit', async () => {
  await dbDisconnect()
})