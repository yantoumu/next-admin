import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
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

  // 转换SafeUser为User类型
  const user = {
    id: safeUser.id,
    email: safeUser.email,
    name: safeUser.name,
    role: safeUser.role,
    created_at: safeUser.created_at.toISOString(),
    updated_at: safeUser.updated_at.toISOString()
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}