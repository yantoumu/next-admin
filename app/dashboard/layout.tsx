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