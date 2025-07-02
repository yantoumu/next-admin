import { requireAuth } from '@/lib/auth-middleware'
import { PageHeader } from '@/components/dashboard/page-header'
import { ProfileForm } from '@/components/profile/profile-form'

export default async function ProfilePage() {
  const user = await requireAuth()

  return (
    <div className="space-y-6">
      <PageHeader
        title="个人资料"
        description="管理您的账户信息和偏好设置"
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 个人信息 */}
        <div className="lg:col-span-2">
          <ProfileForm user={user} />
        </div>
        
        {/* 侧边栏信息 */}
        <div className="space-y-6">
          {/* 账户状态 */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">账户状态</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">账户类型</span>
                <span className="font-medium">{user.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">创建时间</span>
                <span className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">最后更新</span>
                <span className="font-medium">
                  {new Date(user.updated_at).toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>
          </div>

          {/* 安全提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">安全提示</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 定期更换密码</li>
              <li>• 不要在公共设备上登录</li>
              <li>• 发现异常及时联系管理员</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}