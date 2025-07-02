import { requireAuth } from '@/lib/auth-middleware'
import { PageHeader } from '@/components/dashboard/page-header'
import { UserDetail } from '@/components/users/user-detail'
import { hasPermission } from '@/lib/permissions'
import { redirect, notFound } from 'next/navigation'
import { databaseAdapter } from '@/lib/database-adapter'

interface UserDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const currentUser = await requireAuth()
  const { id } = await params
  
  // 检查用户是否有查看用户的权限
  if (!hasPermission(currentUser.role, 'users.view')) {
    redirect('/dashboard')
  }

  // 获取目标用户信息
  const targetUser = await databaseAdapter.getUser(id)
  
  if (!targetUser) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="用户详情"
        description={`查看和管理用户 ${targetUser.name || targetUser.email} 的信息`}
        backUrl="/dashboard/users"
        backText="返回用户列表"
      />
      
      <UserDetail 
        user={targetUser} 
        currentUser={currentUser}
      />
    </div>
  )
}