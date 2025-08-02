# PostgreSQL数据库迁移完整指南

## 🎯 迁移目标

**数据库连接：** `postgres://user_3pGBYP:password_nrtBdd@ssh.seo9.org:5432/czds_monitor`
**策略：** 完全替换MongoDB → PostgreSQL + Prisma ORM
**安全重点：** SQL注入防护 + 数据完整性保障

## 📊 数据库表结构设计

### 核心表结构

#### 1. users表
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,                    -- CUID主键
  email VARCHAR(255) UNIQUE NOT NULL,     -- 邮箱（唯一）
  password VARCHAR(255) NOT NULL,         -- bcrypt哈希密码
  name VARCHAR(100),                      -- 用户姓名
  role user_role DEFAULT 'MEMBER',        -- 用户角色
  created_at TIMESTAMPTZ DEFAULT NOW(),   -- 创建时间
  updated_at TIMESTAMPTZ DEFAULT NOW(),   -- 更新时间
  last_login TIMESTAMPTZ,                 -- 最后登录时间
  login_attempts INTEGER DEFAULT 0,       -- 登录失败次数
  locked_until TIMESTAMPTZ,               -- 账户锁定到期时间
  deleted_at TIMESTAMPTZ                  -- 软删除时间
);
```

#### 2. user_sessions表（JWT会话管理）
```sql
CREATE TABLE user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);
```

#### 3. audit_logs表（安全审计）
```sql
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 索引优化策略
```sql
-- 用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_created ON users(role, created_at);
CREATE INDEX idx_users_deleted ON users(deleted_at);

-- 会话表索引
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- 审计日志索引
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
```

## 🔧 代码修改清单

### 核心文件修改

#### 1. 数据库连接层
- ✅ `lib/db.ts` - 替换为Prisma客户端
- ✅ `prisma/schema.prisma` - 新的PostgreSQL模式
- ✅ `.env.example` - 更新数据库连接字符串

#### 2. 服务层
- ✅ `lib/services/user.service.ts` - 新建用户服务层
- ✅ `lib/auth-postgresql.ts` - 新的认证系统
- 🔄 `lib/auth.ts` - 需要替换为PostgreSQL版本

#### 3. API路由
- ✅ `app/api/users/route.ts` - 更新为使用UserService
- ✅ `app/api/auth/login/route.ts` - 更新导入路径
- 🔄 `app/api/auth/me/route.ts` - 需要更新
- 🔄 `app/api/auth/logout/route.ts` - 需要更新

#### 4. 迁移脚本
- ✅ `scripts/migrate-to-postgresql.ts` - 数据迁移脚本
- 🔄 需要创建种子数据脚本

### 需要删除的文件
- `lib/models/User.ts` - Mongoose模型
- `lib/database-adapter.ts` - MongoDB适配器
- `scripts/mongoose-seed.ts` - MongoDB种子脚本
- `scripts/test-mongo-connection.ts` - MongoDB测试脚本

## 🚀 分步骤迁移执行计划

### 阶段1：环境准备（预计30分钟）

#### 1.1 安装PostgreSQL依赖
```bash
npm install @prisma/client
npm install -D prisma
```

#### 1.2 更新环境变量
```bash
# 更新.env.local
DATABASE_URL="postgres://user_3pGBYP:password_nrtBdd@ssh.seo9.org:5432/czds_monitor"
```

#### 1.3 生成Prisma客户端
```bash
npx prisma generate
npx prisma db push
```

### 阶段2：数据迁移（预计45分钟）

#### 2.1 备份现有数据
```bash
# 自动备份到backups/目录
npx tsx scripts/migrate-to-postgresql.ts
```

#### 2.2 验证迁移结果
```bash
# 检查用户数据
npx prisma studio
```

### 阶段3：代码切换（预计60分钟）

#### 3.1 替换认证系统
```bash
# 备份原文件
mv lib/auth.ts lib/auth-mongodb.ts.bak
mv lib/auth-postgresql.ts lib/auth.ts
```

#### 3.2 更新API路由
- 更新所有auth相关的API路由
- 测试登录/登出功能

#### 3.3 清理MongoDB代码
```bash
# 删除Mongoose相关文件
rm lib/models/User.ts
rm lib/database-adapter.ts
rm scripts/mongoose-seed.ts
```

### 阶段4：测试验证（预计30分钟）

#### 4.1 功能测试
- [ ] 用户登录/登出
- [ ] 用户创建/更新/删除
- [ ] 权限验证
- [ ] 会话管理

#### 4.2 安全测试
- [ ] SQL注入防护
- [ ] JWT token验证
- [ ] 账户锁定机制
- [ ] 审计日志记录

## 🔒 安全防护措施

### SQL注入防护
```typescript
// ✅ 使用Prisma类型安全查询
const user = await prisma.user.findUnique({
  where: { email: userInput } // 自动参数化查询
})

// ❌ 避免原生SQL拼接
// const query = `SELECT * FROM users WHERE email = '${userInput}'`
```

### 密码安全
```typescript
// ✅ 使用bcrypt哈希
const hashedPassword = await bcrypt.hash(password, 12)

// ✅ 密码验证
const isValid = await bcrypt.compare(password, hashedPassword)
```

### 会话管理
```typescript
// ✅ JWT黑名单机制
await prisma.userSession.updateMany({
  where: { token_hash: tokenHash },
  data: { revoked_at: new Date() }
})
```

## 📋 验证检查清单

### 数据完整性
- [ ] 用户数量一致
- [ ] 邮箱唯一性
- [ ] 密码哈希正确
- [ ] 角色映射正确
- [ ] 时间戳保持

### 功能完整性
- [ ] 登录功能正常
- [ ] 用户CRUD操作
- [ ] 权限控制
- [ ] 会话管理
- [ ] 审计日志

### 性能验证
- [ ] 查询响应时间 < 100ms
- [ ] 连接池配置正确
- [ ] 索引使用有效
- [ ] 内存使用合理

## 🔄 回滚计划

### 紧急回滚步骤
1. 恢复原始代码文件
2. 切换回MongoDB连接
3. 验证功能正常
4. 通知相关人员

### 回滚脚本
```bash
#!/bin/bash
# 回滚到MongoDB
mv lib/auth.ts lib/auth-postgresql.ts
mv lib/auth-mongodb.ts.bak lib/auth.ts
# 更新环境变量
# 重启应用
```

## 📞 支持联系

如遇到问题，请联系：
- 技术负责人：[联系方式]
- 紧急联系：[24小时联系方式]

---

**注意：** 执行迁移前请确保已完成完整的数据备份！
