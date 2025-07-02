# 通用后台管理框架 PRD

## 1. 项目背景

面向独立开发者和小型团队，提供 **开箱即用** 的通用后台管理系统骨架，帮助项目在极短时间内启动，并支持后续功能的极速迭代扩展。

## 2. 目标用户

- **开发者 / 初创团队**：需要可扩展、易维护的后台。
- **运营 / 管理人员**：需要直观的可视化界面管理数据。

## 3. 核心目标

| 编号 | 目标                       | 关键指标                                                                                                                                             |
| -- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| G1 | 5 分钟完成骨架部署并生成首个 CRUD 模块  | CLI 一键 scaffold & 可访问管理界面                                                                                                                        |
| G2 | 内置 Supabase 登录 + RBAC 鉴权 | 支持 Email/OAuth/Magic Link；支持角色、权限粒度到 API & Page                                                                                                  |
| G3 | 组件化 UI & 可主题化            | Tailwind 4 + shadcn/ui，预设浅/深色；可替换品牌色，无需改动代码                                                                                                      |
| G4 | API 与数据库完全解耦             | 默认 **Supabase (PostgreSQL)**；可选 **MongoDB** (`DB_MONGO_URI`) 、 **Cloudflare KV** (`KV_BINDING`) 、 **Cloudflare D1** (`D1_DATABASE`)；切换后端 <10 行改动 |
| G5 | 多 / 单租户可切换               | `MULTI_TENANT=true` 时启用组织隔离（Organization + Membership）                                                                                           |
| G6 | 符合 Core Web Vitals & SEO | LCP <2.5s, CLS <0.1（登录页除外）                                                                                                                       |
| G7 | 模块化 & 快速扩展               | 新增功能模块 < 5 文件变更；支持 CLI `pnpm admin generate module`                                                                                              |

## 4. 功能需求

### 4.1 身份认证

- Email + 密码注册 / 登录（**Supabase Auth**）
- 第三方 OAuth：Google、GitHub、Twitter
- 魔术链接登录（可选）
- JWT + Session 双模式（根据 API 场景切换）

### 4.2 鉴权与 RBAC

- 角色：`admin`（系统/租户管理员）、`member`（普通成员）、`editor`、`viewer`，可自定义扩展
- 权限模型：基于 `资源-动作`（CRUD）
- Page 级与 API 级中间件隔离
- 权限分配 UI：树形 + 搜索过滤，可批量赋权

### 4.3 用户管理模块

- 列表 / 搜索 / 分页
- 创建、编辑、禁用、重置密码
- 角色批量赋权
- 组织成员管理（多租户启用时）

### 4.4 通用 CRUD 模板

- 一键生成：列表 / 详情 / 表单三页
- **动态表单 schema**（`zod`）
- 文件上传（S3 / Cloudflare R2 / 本地）

### 4.5 系统设置

- 环境变量可视化（仅显示非密钥字段）
- 主题与品牌配置（logo、颜色）

### 4.6 多租户能力

- **单租户**为默认模式，适合内部后台
- 设置 `MULTI_TENANT=true` 时启用 **Organization / Membership** 数据层与路由隔离
- 组织层级：Organization → Project (可选) → Resource
- RBAC 权限自动限定在 `org_id` 范围内
- 支持跨组织切换下拉 & 邀请邮件

## 5. 非功能需求

- **可访问性**：WCAG AA；完整键盘导航
- **响应式**：≥320px 到超宽屏一致体验
- **i18n**：默认中英文，`next-intl`
- **安全**：OWASP Top 10；CSRF、XSS、Rate‑Limit Middleware
- **测试**：Vitest + Playwright (>80% 覆盖)
- **DevOps**：一键部署至 **Cloudflare Workers** (推荐，自动绑定 KV/D1) 或 Vercel；CI 运行 ESLint、型检、UT、E2E

## 6. 技术栈

| 层级   | 选型                                                                                                 |
| ---- | -------------------------------------------------------------------------------------------------- |
| 前端渲染 | **Next.js 15 App Router** + React 19                                                               |
| 组件库  | **Tailwind CSS 4** + **shadcn/ui**（主题热插拔）                                                          |
| 数据访问 | **Prisma ORM**（Supabase Postgres） + **MongoDB Adapter** / **Drizzle ORM**（D1） + **KV REST Client** |
| Auth | **Supabase Auth** + Optional NextAuth Adapter                                                      |
| API  | Route Handlers / tRPC 变体可切换                                                                        |
| 状态管理 | TanStack Query                                                                                     |
| 表单   | React Hook Form + Zod                                                                              |
| 构建   | Turbopack                                                                                          |

## 7. 数据库模型（简化，支持多租户）

```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String?
  name        String?
  image       String?
  memberships Membership[]
  createdAt   DateTime @default(now())
  sessions    Session[]
}

model Organization {
  id        String   @id @default(cuid())
  name      String
  ownerId   String
  owner     User     @relation(fields: [ownerId], references: [id])
  memberships Membership[]
  createdAt DateTime @default(now())
}

model Membership {
  id       String   @id @default(cuid())
  user     User     @relation(fields: [userId], references: [id])
  userId   String
  org      Organization @relation(fields: [orgId], references: [id])
  orgId    String
  roles    Role[]   @relation("MemberRoles")
  joinedAt DateTime @default(now())
}

model Role {
  id        String   @id @default(cuid())
  name      String   @unique
  members   Membership[] @relation("MemberRoles")
  privileges Privilege[]
}

model Privilege {
  id       String @id @default(cuid())
  resource String
  action   String
  roles    Role[]
}
```

## 8. 页面信息架构

- `/login` – 登录
- `/dashboard` – 总览（仪表卡片）
- `/org/[orgId]/users` – 组织成员（多租户）
- `/org/[orgId]/settings` – 组织设置
- `/org/[orgId]/[resource]` – 动态 CRUD
- `/settings` – 系统设置（单租户）

## 9. UI 设计准则

- 7–12 组件布局（Hero / FeatGrid / CTA / Footer …）可复用
- 管理后台：Card + Table；8pt Grid
- 深色模式：`class="dark"` cookie 存储

## 10. 风险 & 约束

- OAuth / 多租户配置复杂 → 提供 CLI 生成 `.env` & 组织初始化脚本
- RBAC 粒度 & 性能 → 针对 KV / Postgres 分别优化索引

## 11. 里程碑

| 阶段 | 交付物                   | 预计用时 |
| -- | --------------------- | ---- |
| M1 | 技术选型 & 架构骨架           | 2 天  |
| M2 | Supabase Auth & 租户中间件 | 3 天  |
| M3 | 用户 & 组织管理 CRUD        | 3 天  |
| M4 | 通用 CRUD 模板引擎          | 4 天  |
| M5 | UI 主题与系统设置            | 2 天  |
| M6 | 测试、CI/CD & Workers 部署 | 2 天  |

## 12. 部署与环境模板

### 12.1 `.env.example`

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_ANON_KEY=
DB_MONGO_URI=
KV_BINDING=
D1_DATABASE=
MULTI_TENANT=false
```

### 12.2 `wrangler.toml`

```toml
name = "next-admin"
main = "./.vercel/output/static/_worker.js"
compatibility_date = "2025-07-02"
compatibility_flags = ["nodejs_compat"]
account_id = "<CF_ACCOUNT_ID>"

kv_namespaces = [
  { binding = "KV_BINDING", id = "<kv-id>" }
]

d1_databases = [
  { binding = "D1_DATABASE", database_name = "next_admin" }
]

[vars]
NEXT_PUBLIC_SUPABASE_URL = "${env.NEXT_PUBLIC_SUPABASE_URL}"
SUPABASE_ANON_KEY = "${env.SUPABASE_ANON_KEY}"
MULTI_TENANT = "${env.MULTI_TENANT}"
```

### 12.3 部署流水线

1. Push → GitHub Actions CI（lint / test / build）
2. `wrangler deploy --env=production` 部署到 Cloudflare Workers
3. Vercel 作为 Preview 环境

## 13. Supabase Auth 流程（概念）

1. 前端调用 `supabase.auth.signInWithPassword` / OAuth
2. Supabase 返回 `access_token` (JWT)
3. 前端存入 cookie / localStorage
4. `auth-middleware.ts` 解析 JWT，注入 `ctx.user`
5. RBAC 中间件校验 `ctx.user.roles`

## 14. 组件库清单（7‑12 Pattern）

| #  | 组件名                 | 作用   |
| -- | ------------------- | ---- |
| 1  | Hero                | 首屏宣传 |
| 2  | StatsGrid           | 关键指标 |
| 3  | FeatureList         | 功能要点 |
| 4  | PricingTable        | 付费套餐 |
| 5  | CTA                 | 行动号召 |
| 6  | TestimonialCarousel | 用户评价 |
| 7  | FAQAccordion        | 常见问题 |
| 8  | Footer              | 页脚   |
| 9  | Card                | 通用容器 |
| 10 | DataTable           | 数据表格 |
| 11 | Modal               | 确认弹窗 |

