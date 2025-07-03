# 🚀 Next.js Admin Dashboard

一个基于 Next.js 15 + MongoDB 的现代化企业级管理后台系统。

## ✨ 特性

- 🔐 **安全认证系统** - JWT + bcrypt + MongoDB
- 👥 **用户权限管理** - 基于角色的访问控制（RBAC）
- 🎨 **现代化UI** - Tailwind CSS + shadcn/ui
- 📱 **响应式设计** - 支持桌面和移动端
- 🛡️ **企业级安全** - 完整的权限验证和安全措施
- 🌙 **主题切换** - 支持明暗主题
- 📊 **数据管理** - 完整的CRUD操作

## 🛡️ 安全特性

- ✅ **无公开注册** - 只有管理员可以创建用户
- ✅ **JWT认证** - 安全的token认证机制
- ✅ **密码加密** - bcrypt哈希加密
- ✅ **权限控制** - 细粒度的权限管理
- ✅ **安全Cookie** - HttpOnly + Secure设置

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/yantoumu/next-admin.git
cd next-admin
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 配置数据库连接
```

### 4. 初始化数据
```bash
npm run seed
```

### 5. 启动开发服务器
```bash
npm run dev
```

### 6. 访问系统
- 地址：http://localhost:3000
- 默认账户：admin@example.com / admin123456
- **请立即修改默认密码！**

## 📚 文档

- [MongoDB配置指南](doc/README-MONGODB.md)
- [数据种子说明](doc/README-SEED.md)
- [部署指南](doc/DEPLOYMENT.md)
- [安全指南](doc/SECURITY.md)

## 🔧 技术栈

- **前端框架**: Next.js 15 + React 18
- **样式系统**: Tailwind CSS v3 + shadcn/ui
- **数据库**: MongoDB + Mongoose
- **认证系统**: JWT + bcrypt
- **开发语言**: TypeScript
- **包管理器**: npm

## 👥 用户角色

- **super_admin**: 超级管理员，所有权限
- **admin**: 系统管理员，大部分权限
- **member**: 普通成员，基础权限
- **viewer**: 查看者，只读权限

## 🛠️ 开发

```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 初始化数据
npm run seed
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请查看文档或提交 Issue。
