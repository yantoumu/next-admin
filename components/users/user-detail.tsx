'use client'

import { useState } from 'react'
import { User, ROLE_DISPLAY_NAMES } from '@/types/auth'
import { hasPermission, canManageUser } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, Shield, Calendar, Mail, User as UserIcon } from 'lucide-react'

interface UserDetailProps {
  user: User
  currentUser: User
}

export function UserDetail({ user, currentUser }: UserDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'super_admin':
        return 'destructive'
      case 'admin':
        return 'default'
      case 'editor':
        return 'secondary'
      case 'member':
        return 'outline'
      case 'viewer':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const handleDelete = async () => {
    if (!confirm(`确定要删除用户 ${user.name || user.email} 吗？此操作不可撤销。`)) {
      return
    }

    setIsDeleting(true)
    try {
      // TODO: 实现删除用户的API调用
      console.log('Deleting user:', user.id)
      // await deleteUser(user.id)
      // router.push('/dashboard/users')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('删除用户失败')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = () => {
    window.location.href = `/dashboard/users/${user.id}/edit`
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 用户基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            基本信息
          </CardTitle>
          <CardDescription>
            用户的基本账户信息
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.name || '未设置姓名'}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">用户ID</span>
              <span className="text-sm font-mono">{user.id}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">邮箱地址</span>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">用户角色</span>
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {ROLE_DISPLAY_NAMES[user.role]}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 权限与安全 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            权限与安全
          </CardTitle>
          <CardDescription>
            用户权限级别和安全设置
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">权限级别</span>
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {ROLE_DISPLAY_NAMES[user.role]}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">主要权限</span>
              <div className="flex flex-wrap gap-2">
                {user.role === 'super_admin' && (
                  <>
                    <Badge variant="outline" className="text-xs">系统管理</Badge>
                    <Badge variant="outline" className="text-xs">用户管理</Badge>
                    <Badge variant="outline" className="text-xs">内容管理</Badge>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <Badge variant="outline" className="text-xs">用户管理</Badge>
                    <Badge variant="outline" className="text-xs">内容管理</Badge>
                  </>
                )}
                {user.role === 'editor' && (
                  <>
                    <Badge variant="outline" className="text-xs">内容编辑</Badge>
                    <Badge variant="outline" className="text-xs">用户查看</Badge>
                  </>
                )}
                {(user.role === 'member' || user.role === 'viewer') && (
                  <Badge variant="outline" className="text-xs">基础访问</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 时间信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            时间信息
          </CardTitle>
          <CardDescription>
            用户账户的创建和更新时间
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">创建时间</span>
              <span className="text-sm">{formatDate(user.created_at)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">最后更新</span>
              <span className="text-sm">{formatDate(user.updated_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 管理操作 */}
      {canManageUser(currentUser.role, user.role) && (
        <Card>
          <CardHeader>
            <CardTitle>管理操作</CardTitle>
            <CardDescription>
              对此用户执行管理操作
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              {hasPermission(currentUser.role, 'users.edit') && (
                <Button 
                  onClick={handleEdit}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  编辑用户信息
                </Button>
              )}
              
              {hasPermission(currentUser.role, 'users.delete') && 
               user.id !== currentUser.id && (
                <Button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full justify-start"
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? '删除中...' : '删除用户'}
                </Button>
              )}
            </div>
            
            {user.id === currentUser.id && (
              <p className="text-xs text-muted-foreground">
                * 您不能删除自己的账户
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}