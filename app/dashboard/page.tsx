import { PageHeader } from '@/components/dashboard/page-header'
import { requirePermission } from '@/lib/auth-middleware'
import { Users, BarChart3, Settings, Rocket, TrendingUp, Shield, User, ArrowUpRight } from 'lucide-react'
import { EnhancedCard, CardContent } from '@/components/ui/enhanced-card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import Link from 'next/link'

export default async function DashboardPage() {
  await requirePermission('dashboard.view')
  
  return (
    <>
      <PageHeader 
        title="概览" 
        description="欢迎使用通用后台管理系统"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-grid-lg mb-8">
        {/* 统计卡片 - 应用增强组件和动效 */}
        <EnhancedCard variant="interactive" animation="fade" className="group">
          <CardContent className="spacing-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg gradient-brand flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-body-small text-muted-foreground">总用户数</p>
                  <p className="text-heading-2 text-foreground">1,234</p>
                </div>
              </div>
              <div className="text-success text-body-small flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12%
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard variant="interactive" animation="fade" className="group" style={{animationDelay: '0.1s'}}>
          <CardContent className="spacing-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg gradient-success flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-body-small text-muted-foreground">活跃用户</p>
                  <p className="text-heading-2 text-foreground">856</p>
                </div>
              </div>
              <div className="text-success text-body-small flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8%
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard variant="interactive" animation="fade" className="group" style={{animationDelay: '0.2s'}}>
          <CardContent className="spacing-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-success flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-body-small text-muted-foreground">系统状态</p>
                  <p className="text-heading-2 text-success">正常</p>
                </div>
              </div>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard variant="interactive" animation="fade" className="group" style={{animationDelay: '0.3s'}}>
          <CardContent className="spacing-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg gradient-warning flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-body-small text-muted-foreground">运行时间</p>
                  <p className="text-heading-2 text-foreground">99.9%</p>
                </div>
              </div>
              <div className="text-success text-body-small">
                30天
              </div>
            </div>
          </CardContent>
        </EnhancedCard>
      </div>
      
      <EnhancedCard variant="elevated" animation="slide" padding="xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-heading-2 text-foreground">快速开始</h2>
          <EnhancedButton variant="outline" size="sm">
            查看全部
          </EnhancedButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-grid-lg">
          <Link href="/dashboard/users">
            <EnhancedCard variant="interactive" animation="scale" className="text-center group">
              <CardContent className="spacing-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl gradient-brand-subtle flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="text-heading-3 text-foreground mb-2">用户管理</h3>
                <p className="text-body-small text-muted-foreground mb-4">管理系统用户和权限</p>
                <EnhancedButton variant="ghost" size="sm" className="w-full">
                  立即开始
                </EnhancedButton>
              </CardContent>
            </EnhancedCard>
          </Link>

          <Link href="/dashboard/settings">
            <EnhancedCard variant="interactive" animation="scale" className="text-center group" style={{animationDelay: '0.1s'}}>
              <CardContent className="spacing-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl gradient-brand-subtle flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Settings className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="text-heading-3 text-foreground mb-2">系统设置</h3>
                <p className="text-body-small text-muted-foreground mb-4">配置系统参数和选项</p>
                <EnhancedButton variant="ghost" size="sm" className="w-full">
                  立即开始
                </EnhancedButton>
              </CardContent>
            </EnhancedCard>
          </Link>

          <Link href="/dashboard/profile">
            <EnhancedCard variant="interactive" animation="scale" className="text-center group" style={{animationDelay: '0.2s'}}>
              <CardContent className="spacing-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl gradient-brand-subtle flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <User className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="text-heading-3 text-foreground mb-2">个人资料</h3>
                <p className="text-body-small text-muted-foreground mb-4">管理您的个人信息</p>
                <EnhancedButton variant="ghost" size="sm" className="w-full">
                  立即开始
                </EnhancedButton>
              </CardContent>
            </EnhancedCard>
          </Link>
        </div>
      </EnhancedCard>
    </>
  )
}