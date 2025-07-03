import { PageHeader } from '@/components/dashboard/page-header'
import { requirePermission } from '@/lib/auth-middleware'
import { Users, BarChart3, Settings, Rocket, TrendingUp, Shield, User } from 'lucide-react'

export default async function DashboardPage() {
  await requirePermission('dashboard.view')
  
  return (
    <>
      <PageHeader 
        title="概览" 
        description="欢迎使用通用后台管理系统"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* 统计卡片 - 应用新的设计系统 */}
        <div className="bg-card rounded-xl border shadow-soft p-6 animate-fade-in hover:shadow-medium transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg gradient-brand flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-body-small text-muted-foreground">总用户数</p>
              <p className="text-heading-2 text-foreground">--</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-soft p-6 animate-fade-in hover:shadow-medium transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg gradient-success flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-body-small text-muted-foreground">活跃用户</p>
              <p className="text-heading-2 text-foreground">--</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-soft p-6 animate-fade-in hover:shadow-medium transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-success flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-body-small text-muted-foreground">系统状态</p>
              <p className="text-heading-2 text-success">正常</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-soft p-6 animate-fade-in hover:shadow-medium transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg gradient-warning flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-body-small text-muted-foreground">运行时间</p>
              <p className="text-heading-2 text-foreground">99.9%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-xl border shadow-soft p-8 animate-slide-up">
        <h2 className="text-heading-2 text-foreground mb-6">快速开始</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border rounded-xl hover:shadow-medium transition-all duration-300 group cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl gradient-brand-subtle flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-heading-3 text-foreground mb-2">用户管理</h3>
            <p className="text-body-small text-muted-foreground">管理系统用户和权限</p>
          </div>
          <div className="text-center p-6 border rounded-xl hover:shadow-medium transition-all duration-300 group cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl gradient-brand-subtle flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Settings className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-heading-3 text-foreground mb-2">系统设置</h3>
            <p className="text-body-small text-muted-foreground">配置系统参数和选项</p>
          </div>
          <div className="text-center p-6 border rounded-xl hover:shadow-medium transition-all duration-300 group cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl gradient-brand-subtle flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <User className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-heading-3 text-foreground mb-2">个人资料</h3>
            <p className="text-body-small text-muted-foreground">管理您的个人信息</p>
          </div>
        </div>
      </div>
    </>
  )
}