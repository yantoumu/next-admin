'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { SerializedUser } from '@/lib/serialization'
import { TabsProvider } from '@/lib/tabs-context'

interface DashboardLayoutClientProps {
  user: SerializedUser
  children: React.ReactNode
}

export function DashboardLayoutClient({ user, children }: DashboardLayoutClientProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <TabsProvider>
      <div className="flex h-screen bg-background">
        {/* 侧边栏 - 动态宽度 */}
        <div className={`bg-card border-r border-border flex-shrink-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          <Sidebar
            user={user}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 顶部导航 */}
          <Header
            user={user}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={toggleSidebar}
          />

          {/* 页面内容 */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TabsProvider>
  )
}
