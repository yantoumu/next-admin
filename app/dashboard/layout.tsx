import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client'
import { PAGE_ROUTES } from '@/lib/constants'

// 标记为动态路由，因为使用了cookies进行身份验证
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const safeUser = await getCurrentUser()
  
  if (!safeUser) {
    redirect(PAGE_ROUTES.LOGIN)
  }

  // 转换SafeUser为User类型（SerializedUser）
  const user = {
    id: safeUser.id,
    email: safeUser.email,
    name: safeUser.name,
    role: safeUser.role,
    created_at: safeUser.created_at.toISOString(),
    updated_at: safeUser.updated_at.toISOString()
  }

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>
}