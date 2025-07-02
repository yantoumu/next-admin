import { requireAuth } from '@/lib/auth-middleware'
import { PageHeader } from '@/components/dashboard/page-header'
import { hasPermission } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import { PAGE_ROUTES } from '@/lib/constants'
import { SecuritySettingsForm } from '@/components/settings/security-settings-form'

export default async function SecuritySettingsPage() {
  const user = await requireAuth()
  
  // 检查用户是否有编辑设置的权限
  if (!hasPermission(user.role, 'settings.edit')) {
    redirect(PAGE_ROUTES.SETTINGS)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="安全设置"
        description="配置系统的安全策略和用户认证规则"
        backUrl={PAGE_ROUTES.SETTINGS}
        backText="返回设置"
      />
      
      <SecuritySettingsForm currentUser={user} />
    </div>
  )
}