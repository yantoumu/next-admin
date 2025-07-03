'use client'

import { User } from '@/types/auth'
import { useRouter, usePathname } from 'next/navigation'
import { PAGE_ROUTES } from '@/lib/constants'
import { ThemeToggleButton } from '@/components/theme/theme-toggle'
import { SerializedUser } from '@/lib/serialization'
import { Menu } from 'lucide-react'
import { Breadcrumb } from './breadcrumb'
import { Tabs } from './tabs'
import { useTabs } from '@/lib/tabs-context'
import { memo, useCallback, useMemo } from 'react'

interface HeaderProps {
  user: SerializedUser
  isSidebarCollapsed?: boolean
  onToggleSidebar?: () => void
}

const HeaderComponent = function Header({ user, isSidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { getTabByPath } = useTabs()

  // 缓存当前页面的标签信息
  const currentTab = useMemo(() => getTabByPath(pathname), [getTabByPath, pathname])

  // 缓存登出处理函数
  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })

      if (response.ok) {
        router.push('/')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [router])

  return (
    <header className="bg-background border-b border-border">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center flex-1 min-w-0">
          {/* 侧边栏切换按钮 */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md hover:bg-accent transition-colors mr-4 flex-shrink-0"
              title={isSidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
            >
              <Menu size={20} />
            </button>
          )}

          {/* 面包屑导航 */}
          <div className="flex-1 min-w-0">
            {currentTab && (
              <Breadcrumb items={currentTab.breadcrumbs} />
            )}
          </div>
        </div>

        {/* 右侧工具栏 */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* 主题切换 */}
          <ThemeToggleButton />

          {/* 通知 */}
          <button className="p-2 text-muted-foreground hover:text-foreground">
            <span className="sr-only">通知</span>
            🔔
          </button>

          {/* 用户菜单 */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-sm text-foreground hover:text-foreground/80"
              onClick={handleLogout}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block">{user.name}</span>
              <span className="text-xs text-muted-foreground">退出</span>
            </button>
          </div>
        </div>
      </div>

      {/* 标签页容器 */}
      <div className="px-6">
        <Tabs />
      </div>
    </header>
  )
}

// 使用React.memo优化组件，避免不必要的重新渲染
export const Header = memo(HeaderComponent)
