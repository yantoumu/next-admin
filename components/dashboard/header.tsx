'use client'

import { User } from '@/types/auth'
import { useRouter } from 'next/navigation'
import { PAGE_ROUTES } from '@/lib/constants'
import { ThemeToggleButton } from '@/components/theme/theme-toggle'
import { SerializedUser } from '@/lib/serialization'
import { Menu } from 'lucide-react'

interface HeaderProps {
  user: SerializedUser
  isSidebarCollapsed?: boolean
  onToggleSidebar?: () => void
}

export function Header({ user, isSidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
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
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* 侧边栏切换按钮 */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors mr-4"
              title={isSidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
            >
              <Menu size={20} />
            </button>
          )}

          <h1 className="text-lg font-semibold text-gray-900">
            仪表板
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 主题切换 */}
          <ThemeToggleButton />
          
          {/* 通知 */}
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <span className="sr-only">通知</span>
            🔔
          </button>
          
          {/* 用户菜单 */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
              onClick={handleLogout}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block">{user.name}</span>
              <span className="text-xs text-gray-500">退出</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}