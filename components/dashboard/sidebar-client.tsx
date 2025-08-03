'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
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
    name: '站找词',
    href: '/dashboard/domains',
    icon: '🔍',
    permission: 'domains.view'
  },
  {
    name: '关键词分析',
    href: '/dashboard/keywords',
    icon: '🔑',
    permission: 'domains.view'
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

export function SidebarClient({ user, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  // 确保客户端渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  // 在客户端渲染之前返回加载状态
  if (!mounted) {
    return (
      <div className={`flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} bg-card`}>
        <div className="p-6 border-b border-gray-200">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

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
        {menuItems.map((item) => {
          // 检查权限
          if (item.permission && !hasPermission(user.role, item.permission as any)) {
            return null
          }

          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.includes(item.href) || 
                           (item.children?.some(child => pathname.startsWith(child.href)) ?? false)

          return (
            <div key={item.href}>
              {/* 主菜单项 */}
              <div className="flex items-center">
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpanded(item.href)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 text-left ${
                      item.children?.some(child => pathname.startsWith(child.href))
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
                {!isCollapsed && hasChildren && (
                  <button
                    onClick={() => toggleExpanded(item.href)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors ml-1"
                    title={isExpanded ? '收起' : '展开'}
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                )}
              </div>

              {/* 子菜单 */}
              {!isCollapsed && hasChildren && isExpanded && item.children && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.children
                    .filter(child => !child.permission || hasPermission(user.role, child.permission as any))
                    .map((child) => (
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
          )
        })}
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