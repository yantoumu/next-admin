import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔌 正在测试 MongoDB 连接...')
    
    // 尝试连接到数据库
    await prisma.$connect()
    console.log('✅ MongoDB 连接成功!')
    
    // 尝试查询用户表
    console.log('📊 正在检查 users 集合...')
    const userCount = await prisma.user.count()
    console.log(`📈 当前用户数量: ${userCount}`)
    
    // 测试创建一个测试用户
    console.log('🧪 正在测试用户创建...')
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: '测试用户',
        password: 'test123',
        role: 'viewer'
      }
    })
    console.log('✅ 测试用户创建成功:', testUser.id)
    
    // 删除测试用户
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('🗑️  测试用户已删除')
    
    console.log('🎉 MongoDB 连接测试完成!')
    
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()