'use client'

import Link from 'next/link'
import { User } from '@/types/auth'
import { hasPermission } from '@/lib/permissions'
import { PAGE_ROUTES } from '@/lib/constants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Shield, 
  Users, 
  Palette, 
  Bell, 
  Database,
  ChevronRight,
  Lock,
  Globe
} from 'lucide-react'

interface SettingsOverviewProps {
  currentUser: User
}

interface SettingSection {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  permission?: string
  status: 'available' | 'restricted' | 'coming-soon'
  items: string[]
}

export function SettingsOverview({ currentUser }: SettingsOverviewProps) {
  const settingSections: SettingSection[] = [
    {
      title: '通用设置',
      description: '系统基本配置和显示设置',
      icon: <Settings className="h-6 w-6" />,
      href: `${PAGE_ROUTES.SETTINGS}/general`,
      permission: 'settings.edit',
      status: 'available',
      items: ['系统名称', '网站图标', '时区设置', '语言设置']
    },
    {
      title: '安全设置',
      description: '用户认证和系统安全策略',
      icon: <Shield className="h-6 w-6" />,
      href: `${PAGE_ROUTES.SETTINGS}/security`,
      permission: 'settings.edit',
      status: 'available',
      items: ['密码策略', '会话设置', '登录限制', '双因子认证']
    },
    {
      title: '用户管理',
      description: '用户账户和权限配置',
      icon: <Users className="h-6 w-6" />,
      href: PAGE_ROUTES.USERS,
      permission: 'users.view',
      status: 'available',
      items: ['用户列表', '角色权限', '注册审核', '批量操作']
    },
    {
      title: '主题外观',
      description: '界面主题和视觉样式设置',
      icon: <Palette className="h-6 w-6" />,
      href: `${PAGE_ROUTES.SETTINGS}/appearance`,
      permission: 'settings.edit',
      status: 'coming-soon',
      items: ['主题色彩', '深色模式', '布局设置', '自定义CSS']
    },
    {
      title: '通知设置',
      description: '系统通知和邮件配置',
      icon: <Bell className="h-6 w-6" />,
      href: `${PAGE_ROUTES.SETTINGS}/notifications`,
      permission: 'settings.edit',
      status: 'coming-soon',
      items: ['邮件通知', '系统提醒', '推送设置', '通知模板']
    },
    {
      title: '数据管理',
      description: '数据备份和系统维护',
      icon: <Database className="h-6 w-6" />,
      href: `${PAGE_ROUTES.SETTINGS}/data`,
      permission: 'settings.edit',
      status: 'coming-soon',
      items: ['数据备份', '数据导入', '系统清理', '日志管理']
    }
  ]

  const getStatusBadge = (status: SettingSection['status']) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="text-xs">可用</Badge>
      case 'restricted':
        return <Badge variant="secondary" className="text-xs">受限</Badge>
      case 'coming-soon':
        return <Badge variant="outline" className="text-xs">即将推出</Badge>
      default:
        return null
    }
  }

  const getAccessibleSections = () => {
    return settingSections.filter(section => {
      if (section.permission) {
        return hasPermission(currentUser.role, section.permission as any)
      }
      return true
    })
  }

  const accessibleSections = getAccessibleSections()

  return (
    <div className="space-y-6">
      {/* 概览统计 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">可用设置</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accessibleSections.filter(s => s.status === 'available').length}
            </div>
            <p className="text-xs text-muted-foreground">
              您可以访问的设置页面
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">权限级别</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser.role}</div>
            <p className="text-xs text-muted-foreground">
              当前用户角色级别
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">系统状态</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">正常</div>
            <p className="text-xs text-muted-foreground">
              所有服务运行正常
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 设置分类 */}
      <div className="grid gap-6 md:grid-cols-2">
        {accessibleSections.map((section) => {
          const isAccessible = !section.permission || hasPermission(currentUser.role, section.permission as any)
          const isAvailable = section.status === 'available' && isAccessible
          
          return (
            <Card key={section.title} className={`transition-colors ${
              isAvailable ? 'hover:bg-muted/50' : 'opacity-60'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {section.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(section.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    包含功能:
                  </div>
                  <ul className="text-sm space-y-1">
                    {section.items.map((item, index) => (
                      <li key={index} className="flex items-center text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-2">
                    {isAvailable ? (
                      <Link href={section.href}>
                        <Button variant="outline" className="w-full">
                          进入设置
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" disabled className="w-full">
                        {section.status === 'coming-soon' ? '即将推出' : '权限不足'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 快速操作 */}
      {hasPermission(currentUser.role, 'settings.edit') && (
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>
              常用的系统管理操作
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              <Link href={`${PAGE_ROUTES.SETTINGS}/general`}>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  基本设置
                </Button>
              </Link>
              
              <Link href={`${PAGE_ROUTES.SETTINGS}/security`}>
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  安全配置
                </Button>
              </Link>
              
              <Link href={PAGE_ROUTES.USERS}>
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  用户管理
                </Button>
              </Link>
              
              <Button variant="outline" disabled className="w-full">
                <Database className="h-4 w-4 mr-2" />
                数据备份
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}