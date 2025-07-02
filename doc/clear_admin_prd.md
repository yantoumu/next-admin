# 通用后台管理框架 PRD - 完整无歧义版

## 项目架构说明
**重要**: 本项目使用Next.js 15 App Router，前后端不分离架构：
- 所有页面使用Server Components + Client Components
- API使用Route Handlers (app/api/*/route.ts)
- 数据获取在服务端完成，减少客户端请求
- 认证状态通过Server Actions + Cookies管理

## 技术栈（固定配置）
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0", 
  "tailwindcss": "^4.0.0",
  "@tailwindcss/typography": "^0.5.0",
  "tailwindcss-animate": "^1.0.7",
  "@radix-ui/react-slot": "^1.0.2",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

## ⚠️ Tailwind CSS 4 + shadcn/ui 兼容性配置

### 1. tailwind.config.ts 必须配置
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
```

### 2. globals.css CSS变量配置（避免样式不渲染）
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 9% 20%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 10% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## 完整权限系统设计

### 权限角色定义
```typescript
// types/auth.ts
export type UserRole = 'super_admin' | 'admin' | 'member' | 'viewer'

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AuthContext {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
```

### 权限矩阵（明确定义每个角色能访问什么）
```typescript
// lib/permissions.ts
export const PERMISSIONS = {
  // 用户管理
  'users.view': ['super_admin', 'admin'],
  'users.create': ['super_admin', 'admin'], 
  'users.edit': ['super_admin', 'admin'],
  'users.delete': ['super_admin'],
  
  // 系统设置
  'settings.view': ['super_admin', 'admin'],
  'settings.edit': ['super_admin'],
  
  // 仪表板
  'dashboard.view': ['super_admin', 'admin', 'member', 'viewer'],
} as const

export function hasPermission(userRole: UserRole, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(userRole)
}
```

## 完整路由结构 + 权限控制

### 路由结构
```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx                    # 登录页面
│   └── register/
│       └── page.tsx                    # 注册页面（仅super_admin可访问）
├── dashboard/
│   ├── layout.tsx                      # 仪表板布局（需要认证）
│   ├── page.tsx                        # 仪表板首页（所有角色）
│   ├── users/
│   │   ├── page.tsx                    # 用户列表（admin+）
│   │   ├── create/
│   │   │   └── page.tsx                # 创建用户（admin+）
│   │   └── [id]/
│   │       ├── page.tsx                # 用户详情（admin+）
│   │       └── edit/
│   │           └── page.tsx            # 编辑用户（admin+）
│   ├── settings/
│   │   ├── page.tsx                    # 系统设置（admin+）
│   │   ├── general/
│   │   │   └── page.tsx                # 通用设置（super_admin）
│   │   └── security/
│   │       └── page.tsx                # 安全设置（super_admin）
│   └── profile/
│       └── page.tsx                    # 个人资料（所有角色）
└── api/
    ├── auth/
    │   ├── login/
    │   │   └── route.ts                # POST /api/auth/login
    │   ├── logout/
    │   │   └── route.ts                # POST /api/auth/logout
    │   └── me/
    │       └── route.ts                # GET /api/auth/me
    ├── users/
    │   ├── route.ts                    # GET /api/users, POST /api/users
    │   └── [id]/
    │       └── route.ts                # GET/PUT/DELETE /api/users/[id]
    └── settings/
        └── route.ts                    # GET/PUT /api/settings
```

### 权限中间件（每个页面都要检查）
```typescript
// lib/auth-middleware.ts
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCurrentUser } from './auth'
import { hasPermission } from './permissions'

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requirePermission(permission: keyof typeof PERMISSIONS) {
  const user = await requireAuth()
  if (!hasPermission(user.role, permission)) {
    redirect('/dashboard?error=permission_denied')
  }
  return user
}
```

## API 输入输出规范

### 1. 用户相关API

#### GET /api/users（获取用户列表）
**权限**: admin+
**Query参数**:
```typescript
interface UsersQuery {
  page?: number        // 页码，默认1
  limit?: number       // 每页数量，默认10
  search?: string      // 搜索关键词
  role?: UserRole      // 角色筛选
  sort?: 'name' | 'email' | 'created_at'  // 排序字段
  order?: 'asc' | 'desc'  // 排序方向
}
```
**Response**:
```typescript
interface UsersResponse {
  success: boolean
  data: {
    users: User[]
    pagination: {
      current: number
      total: number
      pages: number
      limit: number
    }
  }
}
```

#### POST /api/users（创建用户）
**权限**: admin+
**Body**:
```typescript
interface CreateUserRequest {
  email: string        // 必填，唯一
  name: string        // 必填
  password: string    // 必填，至少8位
  role: UserRole      // 必填
}
```
**Response**:
```typescript
interface CreateUserResponse {
  success: boolean
  data: User
  message: string
}
```

#### PUT /api/users/[id]（更新用户）
**权限**: admin+（或用户本人修改基础信息）
**Body**:
```typescript
interface UpdateUserRequest {
  name?: string
  email?: string
  role?: UserRole     // 仅admin+可修改
  password?: string   // 新密码
}
```

### 2. 认证相关API

#### POST /api/auth/login
**Body**:
```typescript
interface LoginRequest {
  email: string
  password: string
  remember?: boolean  // 是否记住登录
}
```
**Response**:
```typescript
interface LoginResponse {
  success: boolean
  data: {
    user: User
    token: string
  }
  message: string
}
```

#### GET /api/auth/me（获取当前用户信息）
**Response**:
```typescript
interface MeResponse {
  success: boolean
  data: User | null
}
```

## 完整UI布局设计

### 仪表板布局组件
```typescript
// app/dashboard/layout.tsx
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { requireAuth } from '@/lib/auth-middleware'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 - 固定宽度 */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <Sidebar user={user} />
      </div>
      
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部导航 */}
        <Header user={user} />
        
        {/* 页面内容 */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
```

### 侧边栏菜单权限控制
```typescript
// components/dashboard/sidebar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { hasPermission } from '@/lib/permissions'
import { User } from '@/types/auth'

interface MenuItem {
  name: string
  href: string
  icon: string
  permission?: keyof typeof PERMISSIONS
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    name: '概览',
    href: '/dashboard',
    icon: '📊',
    permission: 'dashboard.view'
  },
  {
    name: '用户管理',
    href: '/dashboard/users',
    icon: '👥',
    permission: 'users.view',
    children: [
      { name: '用户列表', href: '/dashboard/users', icon: '📋' },
      { name: '新建用户', href: '/dashboard/users/create', icon: '➕', permission: 'users.create' }
    ]
  },
  {
    name: '系统设置',
    href: '/dashboard/settings',
    icon: '⚙️',
    permission: 'settings.view',
    children: [
      { name: '通用设置', href: '/dashboard/settings/general', icon: '🔧', permission: 'settings.edit' },
      { name: '安全设置', href: '/dashboard/settings/security', icon: '🔒', permission: 'settings.edit' }
    ]
  },
  {
    name: '个人资料',
    href: '/dashboard/profile',
    icon: '👤'
  }
]

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()
  
  const filteredMenuItems = menuItems.filter(item => {
    if (item.permission && !hasPermission(user.role, item.permission)) {
      return false
    }
    if (item.children) {
      item.children = item.children.filter(child => 
        !child.permission || hasPermission(user.role, child.permission)
      )
    }
    return true
  })

  return (
    <div className="flex flex-col h-full">
      {/* Logo区域 */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">管理后台</h2>
        <p className="text-sm text-gray-500 mt-1">{user.name}</p>
      </div>
      
      {/* 菜单区域 */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
            
            {/* 子菜单 */}
            {item.children && (
              <div className="ml-6 mt-2 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                      pathname === child.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{child.icon}</span>
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      
      {/* 底部用户信息 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 页面模板标准化
```typescript
// components/dashboard/page-header.tsx
interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
```

## 开发执行顺序（严格按序）

### Phase 1: 项目初始化 + Tailwind配置
```bash
# 1. 创建项目
npx create-next-app@latest admin-framework --typescript --tailwind --app

# 2. 安装shadcn/ui
npx shadcn-ui@latest init

# 3. 安装组件
npx shadcn-ui@latest add button input card table badge avatar dropdown-menu

# 4. 安装其他依赖
npm install @supabase/supabase-js prisma @prisma/client
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react
```

### Phase 2: 数据库 + 认证配置
- 配置Supabase项目
- 创建数据表
- 设置RLS策略
- 配置认证中间件

### Phase 3: 基础布局 + 权限系统
- 创建Dashboard Layout
- 实现权限检查中间件
- 创建侧边栏组件

### Phase 4: 用户管理功能
- 用户列表页面
- 用户创建/编辑表单
- 用户详情页面
- API路由实现

### Phase 5: 系统设置 + 个人资料
- 设置页面
- 个人资料页面
- 主题切换功能

## Claude Code 执行检查清单

执行前必须确认：
- [ ] Tailwind CSS 4 配置正确
- [ ] CSS变量完整设置
- [ ] shadcn/ui组件正常渲染
- [ ] 权限中间件在每个受保护页面都调用
- [ ] API输入输出类型完整定义
- [ ] 所有路由都有对应的权限检查

**开始执行**: 严格按照Phase顺序，确保每个阶段完成后再进行下一阶段。