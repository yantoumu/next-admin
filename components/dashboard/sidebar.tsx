'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useMemo, useCallback, memo } from 'react'
import { hasPermission } from '@/lib/permissions'
import { User } from '@/types/auth'
import { PAGE_ROUTES } from '@/lib/constants'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'

interface MenuItem {
  name: string
  href: string
  icon: string
  permission?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    name: '概览',
    href: PAGE_ROUTES.DASHBOARD,
    icon: '📊',
    permission: 'dashboard.view'
  },
  {
    name: '用户管理',
    href: PAGE_ROUTES.USERS,
    icon: '👥',
    permission: 'users.view',
    children: [
      { name: '用户列表', href: PAGE_ROUTES.USERS, icon: '📋' },
      { name: '新建用户', href: `${PAGE_ROUTES.USERS}/create`, icon: '➕', permission: 'users.create' }
    ]
  },
  {
    name: '系统设置',
    href: PAGE_ROUTES.SETTINGS,
    icon: '⚙️',
    permission: 'settings.view',
    children: [
      { name: '通用设置', href: `${PAGE_ROUTES.SETTINGS}/general`, icon: '🔧', permission: 'settings.edit' },
      { name: '安全设置', href: `${PAGE_ROUTES.SETTINGS}/security`, icon: '🔒', permission: 'settings.edit' }
    ]
  },
  {
    name: '个人资料',
    href: PAGE_ROUTES.PROFILE,
    icon: '👤'
  }
]

interface SidebarProps {
  user: User
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const SidebarComponent = function Sidebar({ user, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // 缓存切换子菜单展开状态的函数
  const toggleExpanded = useCallback((href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }, [])

  // 缓存检查是否应该展开的函数
  const shouldExpand = useCallback((item: MenuItem) => {
    if (!item.children) return false
    return expandedItems.includes(item.href) ||
           item.children.some(child => pathname.startsWith(child.href))
  }, [expandedItems, pathname])

  // 缓存过滤后的菜单项，只有当用户角色变化时才重新计算
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      if (item.permission && !hasPermission(user.role, item.permission as any)) {
        return false
      }
      if (item.children) {
        // 创建新的children数组，避免修改原始数据
        const filteredChildren = item.children.filter(child =>
          !child.permission || hasPermission(user.role, child.permission as any)
        )
        // 返回新的item对象，避免副作用
        return { ...item, children: filteredChildren }
      }
      return item
    })
  }, [user.role]) // 只依赖用户角色，避免不必要的重新计算

  return (
    <div className={`flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo区域 */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h2 className="text-xl font-bold text-foreground">管理后台</h2>
            <p className="text-sm text-muted-foreground mt-1">{user.name}</p>
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            title={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        )}
      </div>
      
      {/* 菜单区域 */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => (
          <div key={item.href}>
            {/* 主菜单项 */}
            <div className="flex items-center">
              {item.children ? (
                <button
                  onClick={() => toggleExpanded(item.href)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 text-left ${
                    item.children.some(child => pathname.startsWith(child.href))
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className={isCollapsed ? 'mx-auto' : 'mr-3'}>{item.icon}</span>
                  {!isCollapsed && item.name}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className={isCollapsed ? 'mx-auto' : 'mr-3'}>{item.icon}</span>
                  {!isCollapsed && item.name}
                </Link>
              )}

              {/* 展开/收起按钮 */}
              {!isCollapsed && item.children && (
                <button
                  onClick={() => toggleExpanded(item.href)}
                  className="p-1 rounded hover:bg-gray-100 transition-colors ml-1"
                  title={shouldExpand(item) ? '收起' : '展开'}
                >
                  {shouldExpand(item) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}
            </div>

            {/* 子菜单 */}
            {!isCollapsed && item.children && shouldExpand(item) && (
              <div className="ml-6 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
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
          {!isCollapsed && (
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 使用React.memo优化组件，只有props变化时才重新渲染
export const Sidebar = memo(SidebarComponent)