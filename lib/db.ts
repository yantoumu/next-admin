import mongoose from 'mongoose'

const MONGODB_URI = process.env.DATABASE_URL

if (!MONGODB_URI) {
  throw new Error('请在 .env.local 中定义 DATABASE_URL 环境变量')
}

/**
 * 全局 mongoose 缓存
 * 这样可以防止在开发模式下多次连接数据库
 */
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

/**
 * MongoDB 连接函数
 * 使用连接池和缓存来优化性能
 */
async function dbConnect() {
  // 如果已经连接，直接返回缓存的连接
  if (cached.conn) {
    return cached.conn
  }

  // 如果没有连接承诺，创建一个新的连接
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // 禁用缓冲，立即执行命令
      maxPoolSize: 10, // 最大连接池大小
      minPoolSize: 1, // 最小连接池大小
      serverSelectionTimeoutMS: 5000, // 服务器选择超时
      socketTimeoutMS: 45000, // Socket 超时
      family: 4, // 使用 IPv4
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ MongoDB 连接成功')
      return mongoose
    }).catch((error) => {
      console.error('❌ MongoDB 连接失败:', error)
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect