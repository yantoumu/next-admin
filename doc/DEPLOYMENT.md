# 🚀 生产环境部署指南

## 📋 部署前检查清单

### ✅ 安全配置
- [ ] 更改默认的JWT_SECRET为强密码
- [ ] 配置生产环境的MongoDB连接
- [ ] 确保数据库连接使用SSL
- [ ] 设置防火墙规则
- [ ] 配置HTTPS证书

### ✅ 环境变量
```bash
# 生产环境 .env.local
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
JWT_SECRET="your-super-secure-jwt-secret-key-at-least-32-characters"
MULTI_TENANT=false
NODE_ENV=production
```

### ✅ 数据库初始化
```bash
# 1. 运行种子脚本创建管理员账户
npm run seed

# 2. 验证管理员账户
# 默认账户：admin@example.com / admin123456
# 请立即修改默认密码！
```

## 🔧 部署步骤

### 1. Vercel部署（推荐）
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel --prod

# 配置环境变量
vercel env add DATABASE_URL
vercel env add JWT_SECRET
```

### 2. Docker部署
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 3. 传统服务器部署
```bash
# 构建项目
npm run build

# 启动生产服务器
npm start

# 使用PM2管理进程
npm install -g pm2
pm2 start npm --name "next-admin" -- start
```

## 🛡️ 安全建议

### 1. 数据库安全
- 使用MongoDB Atlas或其他托管服务
- 启用数据库认证和SSL
- 定期备份数据
- 限制数据库访问IP

### 2. 应用安全
- 使用HTTPS
- 设置安全头部
- 定期更新依赖
- 监控异常访问

### 3. 访问控制
- 立即修改默认管理员密码
- 定期审查用户权限
- 启用访问日志
- 设置会话超时

## 📊 监控和维护

### 1. 日志监控
- 应用错误日志
- 访问日志
- 数据库连接日志
- 认证失败日志

### 2. 性能监控
- 响应时间
- 数据库查询性能
- 内存使用情况
- CPU使用率

### 3. 备份策略
- 数据库定期备份
- 配置文件备份
- 代码版本控制
- 灾难恢复计划

## 🔄 更新流程

### 1. 代码更新
```bash
# 拉取最新代码
git pull origin main

# 安装依赖
npm install

# 构建项目
npm run build

# 重启服务
pm2 restart next-admin
```

### 2. 数据库迁移
```bash
# 如有数据库结构变更
# 请先备份数据库
# 然后运行迁移脚本
```

## 🆘 故障排除

### 常见问题
1. **数据库连接失败** - 检查DATABASE_URL和网络连接
2. **JWT验证失败** - 检查JWT_SECRET配置
3. **权限错误** - 检查用户角色和权限设置
4. **构建失败** - 检查Node.js版本和依赖

### 联系支持
- 查看项目文档
- 检查GitHub Issues
- 联系开发团队
