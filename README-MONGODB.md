# Next.js 15 + MongoDB 配置说明

## 📋 概述

本项目使用 **Mongoose** 作为 MongoDB ODM，遵循 Next.js + MongoDB 最佳实践。

## 🚀 数据库设置

### 1. 环境变量配置

在 `.env.local` 中设置 MongoDB 连接：

```env
DATABASE_URL="mongodb://mongo_FiE6aD:mongo_QEshwS@172.236.235.77:27017/dome?authSource=admin"
```

### 2. 运行种子数据

```bash
# 创建初始用户数据
npm run seed

# 或者直接运行种子脚本
npx tsx scripts/mongoose-seed.ts
```

## 🏗️ 架构设计

### 连接管理 (`lib/db.ts`)

- ✅ **连接缓存**: 防止重复连接
- ✅ **连接池**: 优化并发性能
- ✅ **错误处理**: 完善的错误处理机制
- ✅ **超时配置**: 避免长时间等待

### 数据模型 (`lib/models/User.ts`)

- ✅ **Schema 验证**: 完整的数据验证
- ✅ **索引优化**: 查询性能优化
- ✅ **安全转换**: JSON 序列化时隐藏密码
- ✅ **角色枚举**: 类型安全的角色定义

## 👤 默认用户账号

| 角色 | 邮箱 | 密码 | 权限描述 |
|------|------|------|----------|
| 超级管理员 | admin@example.com | admin123456 | 所有权限，包括用户管理、系统设置 |
| 系统管理员 | manager@example.com | manager123456 | 用户管理权限，部分系统设置查看 |
| 普通成员 | member@example.com | member123456 | 基本仪表板访问权限 |
| 查看者 | viewer@example.com | viewer123456 | 只读访问权限 |

## 🔐 安全特性

### 密码加密
- **算法**: PBKDF2 + SHA512
- **盐值**: 32字节随机盐
- **迭代**: 10,000次迭代
- **格式**: `hash:salt`

### 数据验证
- 邮箱格式验证
- 密码长度验证
- 角色枚举验证
- 输入数据清理

## 📊 性能优化

### 数据库索引
```javascript
// 自动创建的索引
{ email: 1 }      // 唯一索引，快速查找用户
{ role: 1 }       // 角色查询优化
{ created_at: -1 } // 按创建时间排序
```

### 连接池配置
```javascript
{
  maxPoolSize: 10,    // 最大连接数
  minPoolSize: 1,     // 最小连接数
  serverSelectionTimeoutMS: 5000,  // 服务器选择超时
  socketTimeoutMS: 45000,          // Socket 超时
}
```

## 🧪 开发工具

### 验证数据库连接
```bash
npx tsx scripts/test-mongo-connection.ts
```

### 查看数据库状态
```bash
# 使用 MongoDB Shell 或 MongoDB Compass
mongo "mongodb://mongo_FiE6aD:mongo_QEshwS@172.236.235.77:27017/dome?authSource=admin"
```

## 🔧 API 路由使用

在 API 路由中使用数据库连接：

```typescript
import dbConnect from '@/lib/db'
import User from '@/lib/models/User'

export async function GET() {
  try {
    await dbConnect()
    const users = await User.find({}).select('-password')
    return Response.json({ success: true, data: users })
  } catch (error) {
    return Response.json({ success: false, error: error.message })
  }
}
```

## ⚠️ 生产环境注意事项

1. **更改默认密码**: 立即修改所有默认用户密码
2. **环境变量安全**: 不要将数据库凭证提交到版本控制
3. **连接池配置**: 根据生产环境调整连接池大小
4. **索引优化**: 根据查询模式添加适当索引
5. **监控**: 配置数据库性能监控

## 🚀 部署建议

### Vercel 部署
- 在 Vercel 环境变量中设置 `DATABASE_URL`
- 确保 MongoDB 服务器允许 Vercel IP 连接

### Docker 部署
- 使用环境变量文件管理配置
- 确保网络连通性

### MongoDB Atlas
- 推荐使用 MongoDB Atlas 作为生产数据库
- 配置 IP 白名单和 VPC Peering

## 📚 相关文档

- [Mongoose 官方文档](https://mongoosejs.com/)
- [MongoDB Node.js 驱动文档](https://www.mongodb.com/docs/drivers/node/)
- [Next.js 数据获取](https://nextjs.org/docs/app/building-your-application/data-fetching)