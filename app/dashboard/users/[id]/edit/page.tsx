import { requireAuth } from '@/lib/auth-middleware'
import { PageHeader } from '@/components/dashboard/page-header'
import { UserForm } from '@/components/users/user-form'
import { hasPermission, canManageUser } from '@/lib/permissions'
import { redirect, notFound } from 'next/navigation'
import { databaseAdapter } from '@/lib/database-adapter'

interface EditUserPageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const currentUser = await requireAuth()
  const { id } = await params
  
  // 检查用户是否有编辑用户的权限
  if (!hasPermission(currentUser.role, 'users.edit')) {
    redirect('/dashboard/users')
  }

  // 获取目标用户信息
  const targetUser = await databaseAdapter.getUser(id)
  
  if (!targetUser) {
    notFound()
  }

  // 检查是否有权限管理此用户
  if (!canManageUser(currentUser.role, targetUser.role)) {
    redirect('/dashboard/users')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="编辑用户"
        description={`编辑用户 ${targetUser.name || targetUser.email} 的信息`}
        backUrl={`/dashboard/users/${id}`}
        backText="返回用户详情"
      />
      
      <UserForm 
        currentUser={currentUser}
        targetUser={targetUser}
        mode="edit"
      />
    </div>
  )
}