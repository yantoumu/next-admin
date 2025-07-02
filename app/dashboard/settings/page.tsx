import { requireAuth } from '@/lib/auth-middleware'
import { PageHeader } from '@/components/dashboard/page-header'
import { hasPermission } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import { SettingsOverview } from '@/components/settings/settings-overview'

export default async function SettingsPage() {
  const user = await requireAuth()
  
  // 检查用户是否有查看设置的权限
  if (!hasPermission(user.role, 'settings.view')) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="系统设置"
        description="管理系统的配置和偏好设置"
      />
      
      <SettingsOverview currentUser={user} />
    </div>
  )
}