import { requireAuth } from '@/lib/auth-middleware'
import { PageHeader } from '@/components/dashboard/page-header'
import { UserForm } from '@/components/users/user-form'
import { hasPermission } from '@/lib/permissions'
import { redirect } from 'next/navigation'

export default async function CreateUserPage() {
  const currentUser = await requireAuth()
  
  // 检查用户是否有创建用户的权限
  if (!hasPermission(currentUser.role, 'users.create')) {
    redirect('/dashboard/users')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="新建用户"
        description="创建新的系统用户账户"
        backUrl="/dashboard/users"
        backText="返回用户列表"
      />
      
      <UserForm 
        currentUser={currentUser}
        mode="create"
      />
    </div>
  )
}