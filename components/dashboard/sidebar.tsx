'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { hasPermission } from '@/lib/permissions'
import { User } from '@/types/auth'
import { PAGE_ROUTES } from '@/lib/constants'

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
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  
  const filteredMenuItems = menuItems.filter(item => {
    if (item.permission && !hasPermission(user.role, item.permission as any)) {
      return false
    }
    if (item.children) {
      item.children = item.children.filter(child => 
        !child.permission || hasPermission(user.role, child.permission as any)
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