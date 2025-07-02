import { requireAuth } from '@/lib/auth-middleware'
import { PageHeader } from '@/components/dashboard/page-header'
import { UserList } from '@/components/users/user-list'
import { hasPermission } from '@/lib/permissions'
import { redirect } from 'next/navigation'

export default async function UsersPage() {
  const user = await requireAuth()
  
  // 检查用户是否有查看用户的权限
  if (!hasPermission(user.role, 'users.view')) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="用户管理"
        description="管理系统用户账户和权限"
      />
      
      <UserList currentUser={user} />
    </div>
  )
}