import { PageHeader } from '@/components/dashboard/page-header'
import { requirePermission } from '@/lib/auth-middleware'

export default async function DashboardPage() {
  await requirePermission('dashboard.view')
  
  return (
    <>
      <PageHeader 
        title="概览" 
        description="欢迎使用通用后台管理系统"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* 统计卡片 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总用户数</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">活跃用户</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">系统状态</p>
              <p className="text-2xl font-bold text-green-600">正常</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">运行时间</p>
              <p className="text-2xl font-bold text-gray-900">99.9%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">快速开始</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <span className="text-3xl mb-2 block">👥</span>
            <h3 className="font-medium text-gray-900">用户管理</h3>
            <p className="text-sm text-gray-600 mt-1">管理系统用户和权限</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <span className="text-3xl mb-2 block">⚙️</span>
            <h3 className="font-medium text-gray-900">系统设置</h3>
            <p className="text-sm text-gray-600 mt-1">配置系统参数和选项</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <span className="text-3xl mb-2 block">👤</span>
            <h3 className="font-medium text-gray-900">个人资料</h3>
            <p className="text-sm text-gray-600 mt-1">管理您的个人信息</p>
          </div>
        </div>
      </div>
    </>
  )
}