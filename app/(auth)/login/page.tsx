import { redirect } from 'next/navigation'
import { getCurrentUserServer } from '@/lib/auth'
import { LoginForm } from '@/components/auth/login-form'
import { PAGE_ROUTES } from '@/lib/constants'

export default async function LoginPage() {
  // 检查用户是否已登录，如果已登录则重定向到仪表板
  const user = await getCurrentUserServer()
  
  if (user) {
    redirect(PAGE_ROUTES.DASHBOARD)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo和标题 */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            登录管理后台
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            请输入您的账户信息
          </p>
        </div>

        {/* 登录表单 */}
        <LoginForm />
      </div>
    </div>
  )
}