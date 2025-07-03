'use client'

import { useState, useEffect } from 'react'
import { User, UserRole, ROLE_DISPLAY_NAMES } from '@/types/auth'
import { hasPermission, canManageUser } from '@/lib/permissions'
import { databaseAdapter } from '@/lib/database-adapter'
// Import removed - using props instead
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface UserListProps {
  currentUser: User
}

export function UserList({ currentUser }: UserListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      // 模拟用户数据 - 实际中应该通过API获取
      const mockUsers: User[] = [
        {
          id: 'demo-user-id',
          email: 'admin@example.com',
          name: 'Demo Admin',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'editor-user-id',
          email: 'editor@example.com',
          name: 'Demo Editor',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'member-user-id',
          email: 'member@example.com',
          name: 'Demo Member',
          role: 'member',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'destructive'
      case 'admin':
        return 'default'
      case 'member':
        return 'outline'
      case 'viewer':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">用户列表</h3>
          <Badge variant="outline">{users.length} 用户</Badge>
        </div>
        
        {currentUser && hasPermission(currentUser.role, 'users.create') && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建用户
          </Button>
        )}
      </div>

      {/* 用户表格 */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户信息</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>最后更新</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{user.name || '未设置姓名'}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {ROLE_DISPLAY_NAMES[user.role]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(user.created_at)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(user.updated_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {currentUser && canManageUser(currentUser.role, user.role) && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            window.location.href = `/dashboard/users/${user.id}/edit`
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        {hasPermission(currentUser.role, 'users.delete') && 
                         user.id !== currentUser.id && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              // TODO: 实现删除用户功能
                              console.log('Delete user:', user.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">暂无用户数据</div>
        </div>
      )}
    </div>
  )
}