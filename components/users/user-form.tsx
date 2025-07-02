'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, UserRole, ROLE_DISPLAY_NAMES } from '@/types/auth'
import { canManageUser } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Save, X } from 'lucide-react'

interface UserFormProps {
  currentUser: User
  targetUser?: User
  mode: 'create' | 'edit'
}

interface FormData {
  name: string
  email: string
  password: string
  role: UserRole
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  role?: string
  general?: string
}

export function UserForm({ currentUser, targetUser, mode }: UserFormProps) {
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    name: targetUser?.name || '',
    email: targetUser?.email || '',
    password: '',
    role: targetUser?.role || 'member'
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 获取当前用户可以设置的角色选项
  const getAvailableRoles = (): UserRole[] => {
    const allRoles: UserRole[] = ['viewer', 'member', 'editor', 'admin', 'super_admin']
    
    // 超级管理员可以设置所有角色
    if (currentUser.role === 'super_admin') {
      return allRoles
    }
    
    // 管理员可以设置除超级管理员外的所有角色
    if (currentUser.role === 'admin') {
      return allRoles.filter(role => role !== 'super_admin')
    }
    
    // 编辑员只能设置成员和访客
    if (currentUser.role === 'editor') {
      return ['viewer', 'member']
    }
    
    // 其他角色不能创建/编辑用户
    return []
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // 验证姓名
    if (!formData.name.trim()) {
      newErrors.name = '请输入用户姓名'
    }
    
    // 验证邮箱
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }
    
    // 验证密码（仅在创建模式或输入了密码时）
    if (mode === 'create' && !formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = '密码至少需要6位字符'
    }
    
    // 验证角色权限
    const availableRoles = getAvailableRoles()
    if (!availableRoles.includes(formData.role)) {
      newErrors.role = '您没有权限设置此角色'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // TODO: 实现实际的API调用
      if (mode === 'create') {
        console.log('Creating user:', formData)
        // await createUser(formData)
        router.push('/dashboard/users')
      } else {
        console.log('Updating user:', targetUser?.id, formData)
        // await updateUser(targetUser.id, formData)
        router.push(`/dashboard/users/${targetUser?.id}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ general: '操作失败，请稍后重试' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (mode === 'edit' && targetUser) {
      router.push(`/dashboard/users/${targetUser.id}`)
    } else {
      router.push('/dashboard/users')
    }
  }

  const availableRoles = getAvailableRoles()

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? '新建用户' : '编辑用户'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? '填写用户信息创建新账户' 
            : '修改用户信息并保存更改'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 全局错误 */}
          {errors.general && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {errors.general}
            </div>
          )}
          
          {/* 姓名 */}
          <div className="space-y-2">
            <Label htmlFor="name">用户姓名 *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
              placeholder="请输入用户姓名"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* 邮箱 */}
          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址 *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'border-red-500' : ''}
              placeholder="请输入邮箱地址"
              disabled={mode === 'edit'} // 编辑模式下不能修改邮箱
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
            {mode === 'edit' && (
              <p className="text-xs text-muted-foreground">邮箱地址不可修改</p>
            )}
          </div>
          
          {/* 密码 */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {mode === 'create' ? '密码 *' : '新密码'}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={errors.password ? 'border-red-500' : ''}
              placeholder={mode === 'create' ? '请输入密码' : '留空则不修改密码'}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
            {mode === 'edit' && (
              <p className="text-xs text-muted-foreground">留空则不修改用户密码</p>
            )}
          </div>
          
          {/* 角色选择 */}
          <div className="space-y-2">
            <Label htmlFor="role">用户角色 *</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                <SelectValue placeholder="选择用户角色" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_DISPLAY_NAMES[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting 
                ? (mode === 'create' ? '创建中...' : '保存中...') 
                : (mode === 'create' ? '创建用户' : '保存更改')
              }
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              取消
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}