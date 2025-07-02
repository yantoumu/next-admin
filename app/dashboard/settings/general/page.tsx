import { requireAuth } from '@/lib/auth-middleware'
import { PageHeader } from '@/components/dashboard/page-header'
import { hasPermission } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import { PAGE_ROUTES } from '@/lib/constants'
import { GeneralSettingsForm } from '@/components/settings/general-settings-form'

export default async function GeneralSettingsPage() {
  const user = await requireAuth()
  
  // 检查用户是否有编辑设置的权限
  if (!hasPermission(user.role, 'settings.edit')) {
    redirect(PAGE_ROUTES.SETTINGS)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="通用设置"
        description="配置系统的基本信息和显示设置"
        backUrl={PAGE_ROUTES.SETTINGS}
        backText="返回设置"
      />
      
      <GeneralSettingsForm currentUser={user} />
    </div>
  )
}