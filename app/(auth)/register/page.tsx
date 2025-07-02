import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth-middleware'
import { hasPermission } from '@/lib/permissions'
import { RegisterForm } from '@/components/auth/register-form'
import { PAGE_ROUTES } from '@/lib/constants'

export default async function RegisterPage() {
  // 注册页面需要管理员权限访问
  const user = await requireAuth()
  
  if (!hasPermission(user.role, 'users.create')) {
    redirect(PAGE_ROUTES.DASHBOARD)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">管理后台</h1>
            </div>
            <a 
              href={PAGE_ROUTES.DASHBOARD}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              返回仪表板
            </a>
          </div>
        </div>
      </div>

      {/* 注册表单容器 */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              新建用户账户
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              为系统创建新的用户账户
            </p>
          </div>

          <RegisterForm currentUser={user} />
        </div>
      </div>
    </div>
  )
}