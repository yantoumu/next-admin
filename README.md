# 🚀 Next.js Admin Dashboard - 完整项目文档

一个基于 Next.js 15 + MongoDB 的现代化企业级管理后台系统。本文档提供了项目的完整技术说明和开发指南。

## 📋 目录

- [项目概述](#项目概述)
- [核心功能](#核心功能)
- [项目架构](#项目架构)
- [技术栈详解](#技术栈详解)
- [目录结构](#目录结构)
- [通用组件库](#通用组件库)
- [API接口文档](#api接口文档)
- [数据模型](#数据模型)
- [权限系统](#权限系统)
- [开发指南](#开发指南)
- [部署指南](#部署指南)

## 🎯 项目概述

### 系统特性

- 🔐 **企业级安全认证** - JWT + bcrypt + MongoDB，无公开注册漏洞
- 👥 **完整用户管理** - 基于角色的访问控制（RBAC），支持4级权限
- 🎨 **现代化UI设计** - Tailwind CSS v3 + shadcn/ui，响应式设计
- 🌙 **主题系统** - 支持明暗主题切换，用户偏好记忆
- 📊 **数据管理** - 完整的CRUD操作，分页、搜索、排序
- 🛡️ **安全防护** - 权限验证、输入验证、错误处理
- 🚀 **生产就绪** - 完整的部署文档和监控指南

### 业务场景

适用于各种企业级管理后台：
- 内容管理系统（CMS）
- 客户关系管理（CRM）
- 企业资源规划（ERP）
- 用户管理系统
- 数据分析平台

## 🔧 核心功能

### 1. 认证与授权系统

**登录认证**
- 邮箱密码登录
- JWT Token认证
- 记住我功能（7天有效期）
- 安全的HttpOnly Cookie存储

**权限管理**
- 4级用户角色：super_admin、admin、member、viewer
- 细粒度权限控制：users.view、users.create、settings.edit等
- 页面级和API级权限验证
- 动态权限检查和路由保护

### 2. 用户管理模块

**用户列表**
- 分页显示（可配置每页数量）
- 多字段搜索（姓名、邮箱）
- 角色筛选和排序
- 批量操作支持

**用户操作**
- 创建新用户（仅管理员）
- 编辑用户信息
- 角色权限分配
- 用户状态管理

### 3. 系统设置

**通用设置**
- 系统基本信息配置
- 主题和品牌设置
- 环境变量管理

**安全设置**
- 密码策略配置
- 会话管理设置
- 安全日志查看

### 4. 个人资料管理

**资料编辑**
- 个人信息修改
- 密码更改
- 偏好设置

## 🏗️ 项目架构

### 整体架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 (React)   │    │  API Routes     │    │  数据库 (MongoDB) │
│                 │    │                 │    │                 │
│ • Pages         │◄──►│ • 认证API       │◄──►│ • 用户集合       │
│ • Components    │    │ • 用户API       │    │ • 设置集合       │
│ • Hooks         │    │ • 设置API       │    │ • 索引优化       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   状态管理       │    │   中间件层       │    │   数据访问层     │
│                 │    │                 │    │                 │
│ • React State   │    │ • 权限验证       │    │ • Mongoose ODM  │
│ • Form State    │    │ • 错误处理       │    │ • 数据验证       │
│ • Theme State   │    │ • 日志记录       │    │ • 查询优化       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 数据流架构

```
用户操作 → 页面组件 → API调用 → 权限验证 → 业务逻辑 → 数据库操作 → 响应返回
   ↓         ↓         ↓         ↓         ↓         ↓         ↓
 UI交互   状态更新   HTTP请求  中间件检查  数据处理  MongoDB   JSON响应
```

### 安全架构

```
┌─────────────────────────────────────────────────────────────┐
│                        安全层级                              │
├─────────────────────────────────────────────────────────────┤
│ 1. 网络层安全    │ HTTPS、防火墙、DDoS防护                  │
│ 2. 应用层安全    │ JWT认证、权限验证、输入验证              │
│ 3. 数据层安全    │ 数据加密、访问控制、备份策略              │
│ 4. 代码层安全    │ 依赖扫描、代码审计、安全编码              │
└─────────────────────────────────────────────────────────────┘
```

## 💻 技术栈详解

### 核心框架

| 技术 | 版本 | 作用 | 选择原因 |
|------|------|------|----------|
| **Next.js** | ^15.0.0 | 全栈React框架 | App Router、SSR、API Routes一体化 |
| **React** | ^18.3.0 | 前端UI框架 | 组件化、生态丰富、性能优秀 |
| **TypeScript** | ^5.0.0 | 类型安全 | 编译时错误检查、代码提示 |

### 样式系统

| 技术 | 版本 | 作用 | 选择原因 |
|------|------|------|----------|
| **Tailwind CSS** | ^3.4.0 | 原子化CSS框架 | 快速开发、一致性、可维护性 |
| **shadcn/ui** | latest | UI组件库 | 现代设计、可定制、无依赖 |
| **Radix UI** | ^1.x.x | 无头组件库 | 可访问性、键盘导航、WAI-ARIA |
| **Lucide React** | ^0.300.0 | 图标库 | 轻量级、一致性、可定制 |
| **next-themes** | ^0.2.1 | 主题管理 | 暗色模式、用户偏好、SSR支持 |

### 数据层

| 技术 | 版本 | 作用 | 选择原因 |
|------|------|------|----------|
| **MongoDB** | latest | NoSQL数据库 | 灵活schema、水平扩展、JSON原生 |
| **Mongoose** | ^8.16.1 | ODM对象映射 | 数据验证、中间件、类型安全 |
| **Prisma** | ^5.7.0 | 数据库工具 | 类型生成、迁移管理、查询构建 |

### 认证与安全

| 技术 | 版本 | 作用 | 选择原因 |
|------|------|------|----------|
| **jsonwebtoken** | ^9.0.2 | JWT令牌 | 无状态认证、跨域支持、标准化 |
| **bcryptjs** | ^3.0.2 | 密码哈希 | 安全性高、抗彩虹表、自适应 |
| **Zod** | ^3.22.0 | 数据验证 | 类型推断、运行时验证、错误处理 |

### 表单处理

| 技术 | 版本 | 作用 | 选择原因 |
|------|------|------|----------|
| **React Hook Form** | ^7.48.0 | 表单管理 | 性能优秀、验证集成、易用性 |
| **@hookform/resolvers** | ^3.3.0 | 验证集成 | Zod集成、类型安全、统一API |

### 开发工具

| 技术 | 版本 | 作用 | 选择原因 |
|------|------|------|----------|
| **ESLint** | ^8.0.0 | 代码检查 | 代码质量、团队规范、错误预防 |
| **tsx** | ^4.20.3 | TypeScript执行 | 脚本运行、开发工具、类型支持 |
| **PostCSS** | ^8.0.0 | CSS处理 | Tailwind支持、插件生态 |

### 工具库

| 技术 | 版本 | 作用 | 选择原因 |
|------|------|------|----------|
| **clsx** | ^2.0.0 | 类名组合 | 条件样式、性能优秀、轻量级 |
| **tailwind-merge** | ^2.0.0 | 样式合并 | 冲突解决、智能合并、类型安全 |
| **class-variance-authority** | ^0.7.0 | 变体管理 | 组件变体、类型安全、可维护性 |

## 📁 目录结构

### 项目根目录

```
next-admin/
├── 📁 app/                    # Next.js 15 App Router
│   ├── 📁 (auth)/            # 认证相关页面组
│   ├── 📁 api/               # API路由
│   ├── 📁 dashboard/         # 管理后台页面
│   ├── 📁 unauthorized/      # 未授权页面
│   ├── 📄 globals.css        # 全局样式
│   ├── 📄 layout.tsx         # 根布局
│   ├── 📄 page.tsx          # 首页
│   ├── 📄 error.tsx         # 错误页面
│   └── 📄 not-found.tsx     # 404页面
├── 📁 components/            # React组件
├── 📁 lib/                   # 工具库和配置
├── 📁 types/                 # TypeScript类型定义
├── 📁 doc/                   # 项目文档
├── 📁 scripts/               # 脚本文件
├── 📁 prisma/                # 数据库配置
├── 📄 package.json           # 项目配置
├── 📄 tailwind.config.ts     # Tailwind配置
├── 📄 tsconfig.json          # TypeScript配置
└── 📄 next.config.js         # Next.js配置
```

### App目录详解

```
app/
├── 📁 (auth)/                # 认证页面组（共享布局）
│   └── 📁 login/
│       └── 📄 page.tsx       # 登录页面
├── 📁 api/                   # API路由
│   ├── 📁 auth/              # 认证API
│   │   ├── 📁 login/         # 登录API
│   │   ├── 📁 logout/        # 登出API
│   │   └── 📁 me/            # 当前用户API
│   ├── 📁 users/             # 用户管理API
│   │   ├── 📁 [id]/          # 单个用户API
│   │   └── 📄 route.ts       # 用户列表API
│   └── 📁 settings/          # 设置API
│       └── 📄 route.ts       # 设置API
├── 📁 dashboard/             # 管理后台
│   ├── 📄 layout.tsx         # Dashboard布局
│   ├── 📄 page.tsx          # Dashboard首页
│   ├── 📁 users/             # 用户管理
│   │   ├── 📄 page.tsx       # 用户列表
│   │   └── 📁 create/        # 创建用户
│   │       └── 📄 page.tsx
│   ├── 📁 settings/          # 系统设置
│   │   └── 📄 page.tsx
│   └── 📁 profile/           # 个人资料
│       └── 📄 page.tsx
└── 📁 unauthorized/          # 未授权页面
    └── 📄 page.tsx
```

### Components目录详解

```
components/
├── 📁 ui/                    # 基础UI组件（shadcn/ui）
│   ├── 📄 button.tsx         # 按钮组件
│   ├── 📄 input.tsx          # 输入框组件
│   ├── 📄 card.tsx           # 卡片组件
│   ├── 📄 table.tsx          # 表格组件
│   ├── 📄 dialog.tsx         # 对话框组件
│   ├── 📄 form.tsx           # 表单组件
│   ├── 📄 select.tsx         # 选择器组件
│   ├── 📄 avatar.tsx         # 头像组件
│   ├── 📄 badge.tsx          # 标签组件
│   ├── 📄 dropdown-menu.tsx  # 下拉菜单组件
│   └── 📄 label.tsx          # 标签组件
├── 📁 auth/                  # 认证相关组件
│   ├── 📄 login-form.tsx     # 登录表单
│   └── 📄 permission-guard.tsx # 权限守卫组件
├── 📁 dashboard/             # Dashboard组件
│   ├── 📄 sidebar.tsx        # 侧边栏导航
│   ├── 📄 header.tsx         # 顶部导航
│   └── 📄 page-header.tsx    # 页面标题组件
├── 📁 users/                 # 用户管理组件
│   ├── 📄 user-list.tsx      # 用户列表
│   ├── 📄 user-form.tsx      # 用户表单
│   └── 📄 user-detail.tsx    # 用户详情
├── 📁 settings/              # 设置组件
│   ├── 📄 settings-overview.tsx        # 设置概览
│   ├── 📄 general-settings-form.tsx    # 通用设置表单
│   └── 📄 security-settings-form.tsx   # 安全设置表单
├── 📁 profile/               # 个人资料组件
│   └── 📄 profile-form.tsx   # 资料表单
└── 📁 theme/                 # 主题相关组件
    ├── 📄 theme-provider.tsx # 主题提供者
    └── 📄 theme-toggle.tsx   # 主题切换按钮
```

### Lib目录详解

```
lib/
├── 📄 auth.ts                # 认证工具函数
├── 📄 auth-context.ts        # 认证上下文
├── 📄 auth-middleware.ts     # 认证中间件
├── 📄 permissions.ts         # 权限定义和检查
├── 📄 database-adapter.ts    # 数据库适配器
├── 📄 db.ts                  # 数据库连接
├── 📄 api-response.ts        # API响应格式化
├── 📄 error-handler.ts       # 错误处理
├── 📄 constants.ts           # 常量定义
├── 📄 utils.ts               # 通用工具函数
├── 📁 models/                # 数据模型
│   └── 📄 User.ts            # 用户模型
├── 📁 validations/           # 数据验证
│   └── 📄 auth.ts            # 认证相关验证
└── 📁 utils/                 # 工具函数
    └── 📄 cn.ts              # 类名合并工具
```

## 🧩 通用组件库

### 基础UI组件

#### Button 按钮组件
```typescript
// 使用示例
<Button variant="default" size="md" onClick={handleClick}>
  点击按钮
</Button>

// 变体类型
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
type ButtonSize = "default" | "sm" | "lg" | "icon"
```

#### Input 输入框组件
```typescript
// 使用示例
<Input
  type="email"
  placeholder="请输入邮箱"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// 支持的类型
type InputType = "text" | "email" | "password" | "number" | "tel" | "url"
```

#### Card 卡片组件
```typescript
// 使用示例
<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述</CardDescription>
  </CardHeader>
  <CardContent>
    卡片内容
  </CardContent>
  <CardFooter>
    <Button>操作按钮</Button>
  </CardFooter>
</Card>
```

#### Table 表格组件
```typescript
// 使用示例
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>姓名</TableHead>
      <TableHead>邮箱</TableHead>
      <TableHead>角色</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 业务组件

#### PermissionGuard 权限守卫
```typescript
// 使用示例
<PermissionGuard permission="users.create">
  <Button>创建用户</Button>
</PermissionGuard>

// 多权限检查
<PermissionGuard permissions={["users.view", "users.edit"]} requireAll={false}>
  <UserManagement />
</PermissionGuard>
```

#### UserForm 用户表单
```typescript
// 使用示例
<UserForm
  mode="create" // "create" | "edit"
  initialData={userData}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

#### ThemeToggle 主题切换
```typescript
// 使用示例
<ThemeToggle />

// 自定义样式
<ThemeToggle className="ml-auto" />
```

## 🔌 API接口文档

### 认证API

#### POST /api/auth/login
用户登录接口

**请求参数：**
```typescript
{
  email: string;      // 用户邮箱
  password: string;   // 用户密码
  remember?: boolean; // 记住我（可选）
}
```

**响应格式：**
```typescript
{
  success: true,
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      created_at: string;
      updated_at: string;
    }
  },
  message: "登录成功"
}
```

#### POST /api/auth/logout
用户登出接口

**权限要求：** 需要认证
**响应格式：**
```typescript
{
  success: true,
  data: null,
  message: "登出成功"
}
```

#### GET /api/auth/me
获取当前用户信息

**权限要求：** 需要认证
**响应格式：**
```typescript
{
  success: true,
  data: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    permissions: string[];
    created_at: string;
    updated_at: string;
  },
  message: "获取用户信息成功"
}
```

### 用户管理API

#### GET /api/users
获取用户列表（分页、搜索、筛选）

**权限要求：** `users.view`
**查询参数：**
```typescript
{
  page?: number;      // 页码（默认1）
  limit?: number;     // 每页数量（默认10）
  search?: string;    // 搜索关键词
  role?: UserRole;    // 角色筛选
  sort?: string;      // 排序字段（默认created_at）
  order?: 'asc' | 'desc'; // 排序方向（默认desc）
}
```

**响应格式：**
```typescript
{
  success: true,
  data: {
    items: User[];
    pagination: {
      current: number;
      total: number;
      pages: number;
      limit: number;
      hasNext: boolean;
      hasPrev: boolean;
    }
  },
  message: "用户列表获取成功"
}
```

#### POST /api/users
创建新用户

**权限要求：** `users.create`
**请求参数：**
```typescript
{
  email: string;
  password: string;
  name?: string;
  role: UserRole;
}
```

#### GET /api/users/[id]
获取单个用户详情

**权限要求：** `users.view`

#### PUT /api/users/[id]
更新用户信息

**权限要求：** `users.edit`

#### DELETE /api/users/[id]
删除用户

**权限要求：** `users.delete`

### 设置API

#### GET /api/settings
获取系统设置

**权限要求：** `settings.view`

#### PUT /api/settings
更新系统设置

**权限要求：** `settings.edit`

## 📊 数据模型

### User 用户模型

```typescript
interface User {
  id: string;                    // 用户ID
  email: string;                 // 邮箱（唯一）
  password?: string;             // 密码（哈希后，查询时不返回）
  name?: string;                 // 姓名
  role: UserRole;                // 用户角色
  created_at: Date;              // 创建时间
  updated_at: Date;              // 更新时间
}

enum UserRole {
  SUPER_ADMIN = 'super_admin',   // 超级管理员
  ADMIN = 'admin',               // 系统管理员
  MEMBER = 'member',             // 普通成员
  VIEWER = 'viewer'              // 查看者
}
```

### MongoDB集合结构

```javascript
// users 集合
{
  _id: ObjectId,
  email: String,        // 唯一索引
  password: String,     // bcrypt哈希
  name: String,
  role: String,         // 枚举值
  created_at: Date,     // 索引
  updated_at: Date
}

// 索引配置
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ created_at: -1 })
```

## 🔐 权限系统

### 权限矩阵

| 权限 | super_admin | admin | member | viewer | 说明 |
|------|-------------|-------|--------|--------|------|
| `users.view` | ✅ | ✅ | ❌ | ❌ | 查看用户列表 |
| `users.create` | ✅ | ✅ | ❌ | ❌ | 创建新用户 |
| `users.edit` | ✅ | ✅ | ❌ | ❌ | 编辑用户信息 |
| `users.delete` | ✅ | ❌ | ❌ | ❌ | 删除用户 |
| `settings.view` | ✅ | ✅ | ❌ | ❌ | 查看系统设置 |
| `settings.edit` | ✅ | ❌ | ❌ | ❌ | 修改系统设置 |
| `dashboard.view` | ✅ | ✅ | ✅ | ✅ | 访问仪表板 |
| `profile.view` | ✅ | ✅ | ✅ | ✅ | 查看个人资料 |
| `profile.edit` | ✅ | ✅ | ✅ | ✅ | 编辑个人资料 |

### 权限检查函数

```typescript
// 检查单个权限
function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles.includes(userRole);
}

// 检查多个权限（任一）
function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

// 检查多个权限（全部）
function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

// 角色层级比较
function isHigherRole(roleA: UserRole, roleB: UserRole): boolean {
  const hierarchy = { viewer: 1, member: 2, admin: 3, super_admin: 4 };
  return hierarchy[roleA] > hierarchy[roleB];
}
```

### 权限中间件使用

```typescript
// API路由权限检查
export async function GET(request: NextRequest) {
  try {
    // 检查权限
    await requirePermission('users.view');

    // 业务逻辑
    const users = await getUsers();
    return NextResponse.json(createSuccessResponse(users));
  } catch (error) {
    return handleAPIError(error);
  }
}

// 页面权限检查
export default async function UsersPage() {
  const user = await getCurrentUserServer();

  if (!user || !hasPermission(user.role, 'users.view')) {
    redirect('/unauthorized');
  }

  return <UsersList />;
}
```

## 🛠️ 开发指南

### 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/yantoumu/next-admin.git
cd next-admin

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 配置数据库连接

# 4. 初始化数据
npm run seed

# 5. 启动开发服务器
npm run dev
```

### 🔑 默认登录账号

系统初始化后会自动创建以下测试账号：

| 角色 | 邮箱 | 密码 | 权限说明 |
|------|------|------|----------|
| **超级管理员** | `admin@example.com` | `admin123456` | 拥有所有权限，包括用户管理、系统设置等 |
| **管理员** | `editor@example.com` | `editor123456` | 拥有用户查看、编辑权限，无删除权限 |
| **普通成员** | `member@example.com` | `member123456` | 只能访问仪表板和个人资料 |

> ⚠️ **安全提醒**：
> - 生产环境部署前请务必修改默认密码
> - 建议删除或禁用不需要的测试账号
> - 定期更新管理员密码，使用强密码策略

### 环境变量配置

```bash
# .env.local
DATABASE_URL="mongodb://username:password@host:port/database?authSource=admin"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
MULTI_TENANT=false
NODE_ENV=development
```

### 开发命令

```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 类型检查
npm run type-check

# 初始化数据
npm run seed
```

### 添加新功能模块

#### 1. 创建数据模型

```typescript
// lib/models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
```

#### 2. 添加权限定义

```typescript
// lib/permissions.ts
export const PERMISSIONS = {
  // 现有权限...

  // 产品管理
  'products.view': ['super_admin', 'admin'],
  'products.create': ['super_admin', 'admin'],
  'products.edit': ['super_admin', 'admin'],
  'products.delete': ['super_admin'],
} as const;
```

#### 3. 创建API路由

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth-middleware';
import { createSuccessResponse } from '@/lib/api-response';
import Product from '@/lib/models/Product';

export async function GET(request: NextRequest) {
  try {
    await requirePermission('products.view');

    const products = await Product.find().sort({ created_at: -1 });

    return NextResponse.json(
      createSuccessResponse(products, '产品列表获取成功')
    );
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requirePermission('products.create');

    const body = await request.json();
    const product = await Product.create(body);

    return NextResponse.json(
      createSuccessResponse(product, '产品创建成功'),
      { status: 201 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
```

#### 4. 创建页面组件

```typescript
// app/dashboard/products/page.tsx
import { requirePermission } from '@/lib/auth-middleware';
import { ProductsList } from '@/components/products/products-list';
import { PageHeader } from '@/components/dashboard/page-header';

export default async function ProductsPage() {
  // 服务端权限检查
  await requirePermission('products.view');

  return (
    <div className="space-y-6">
      <PageHeader
        title="产品管理"
        description="管理系统中的所有产品"
      />
      <ProductsList />
    </div>
  );
}
```

#### 5. 创建组件

```typescript
// components/products/products-list.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error('获取产品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">产品列表</h2>
        <Button>添加产品</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>价格</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>¥{product.price}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">编辑</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

#### 6. 更新导航菜单

```typescript
// components/dashboard/sidebar.tsx
const menuItems = [
  // 现有菜单项...
  {
    title: '产品管理',
    href: '/dashboard/products',
    icon: Package,
    permission: 'products.view'
  },
];
```

### 代码规范

#### 文件命名
- **页面文件**: `kebab-case` (如: `user-management.tsx`)
- **组件文件**: `kebab-case` (如: `user-form.tsx`)
- **工具文件**: `kebab-case` (如: `api-client.ts`)
- **类型文件**: `kebab-case` (如: `user-types.ts`)

#### 组件命名
- **React组件**: `PascalCase` (如: `UserForm`)
- **函数**: `camelCase` (如: `getUserList`)
- **常量**: `UPPER_SNAKE_CASE` (如: `API_BASE_URL`)
- **类型**: `PascalCase` (如: `UserRole`)

#### 目录结构规范
```
新功能模块/
├── 📁 app/dashboard/[module]/     # 页面
├── 📁 components/[module]/        # 组件
├── 📁 lib/models/                 # 数据模型
├── 📁 app/api/[module]/          # API路由
└── 📁 types/                     # 类型定义
```

## 🚀 部署指南

### 环境要求

- **Node.js**: >= 18.0.0
- **MongoDB**: >= 5.0
- **内存**: >= 512MB
- **存储**: >= 1GB

### 生产环境配置

```bash
# .env.production
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
JWT_SECRET="your-super-secure-production-jwt-secret-at-least-32-characters"
MULTI_TENANT=false
NODE_ENV=production
```

### Vercel部署（推荐）

```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 部署项目
vercel --prod

# 4. 配置环境变量
vercel env add DATABASE_URL
vercel env add JWT_SECRET
```

### Docker部署

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 构建应用
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# 运行应用
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### 传统服务器部署

```bash
# 1. 构建项目
npm run build

# 2. 使用PM2管理进程
npm install -g pm2

# 3. 创建PM2配置
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'next-admin',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};

# 4. 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 安全检查清单

- [ ] 更改默认JWT_SECRET为强密码
- [ ] 配置HTTPS证书
- [ ] 设置防火墙规则
- [ ] 启用数据库认证
- [ ] 配置备份策略
- [ ] 设置监控告警
- [ ] 修改默认管理员密码
- [ ] 定期更新依赖包

## 📚 相关文档

- [MongoDB配置指南](doc/README-MONGODB.md)
- [数据种子说明](doc/README-SEED.md)
- [安全指南](doc/SECURITY.md)
- [部署指南](doc/DEPLOYMENT.md)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 支持与反馈

- 🐛 **Bug报告**: [GitHub Issues](https://github.com/yantoumu/next-admin/issues)
- 💡 **功能建议**: [GitHub Discussions](https://github.com/yantoumu/next-admin/discussions)
- 📧 **邮件支持**: support@example.com
- 📖 **文档问题**: 请提交Issue或PR

---

**⭐ 如果这个项目对你有帮助，请给个Star支持一下！**
