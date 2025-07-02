'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// Import removed - will use API route instead
import { User, UserRole, ROLE_DISPLAY_NAMES } from '@/types/auth'
import { PAGE_ROUTES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, UserPlus, ArrowLeft } from 'lucide-react'

interface RegisterFormProps {
  currentUser: User
}

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  role?: string
  general?: string
}

export function RegisterForm({ currentUser }: RegisterFormProps) {
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member'
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  // 获取当前用户可以创建的角色选项
  const getAvailableRoles = (): UserRole[] => {
    const allRoles: UserRole[] = ['viewer', 'member', 'editor', 'admin', 'super_admin']
    
    if (currentUser.role === 'super_admin') {
      return allRoles
    }
    
    if (currentUser.role === 'admin') {
      return allRoles.filter(role => role !== 'super_admin')
    }
    
    return ['viewer', 'member']
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入用户姓名'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }
    
    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6位字符'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }
    
    const availableRoles = getAvailableRoles()
    if (!availableRoles.includes(formData.role)) {
      newErrors.role = '您没有权限创建此角色的用户'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      // TODO: 实现注册API调用
      console.log('Creating user:', formData)
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      // if (!response.ok) throw new Error('Registration failed')
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push(PAGE_ROUTES.USERS)
    } catch (error: any) {
      console.error('Registration error:', error)
      
      if (error.message?.includes('User already registered')) {
        setErrors({ email: '该邮箱已被注册' })
      } else {
        setErrors({ general: '注册失败，请稍后重试' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(PAGE_ROUTES.USERS)
  }

  const availableRoles = getAvailableRoles()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          新建用户
        </CardTitle>
        <CardDescription>
          创建新的系统用户账户
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
          
          {/* 用户姓名 */}
          <div className="space-y-2">
            <Label htmlFor="name">用户姓名 *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
              placeholder="请输入用户姓名"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* 邮箱地址 */}
          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址 *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'border-red-500' : ''}
              placeholder="请输入邮箱地址"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          {/* 密码 */}
          <div className="space-y-2">
            <Label htmlFor="password">密码 *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={errors.password ? 'border-red-500' : ''}
              placeholder="请输入密码（至少6位）"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          {/* 确认密码 */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码 *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={errors.confirmPassword ? 'border-red-500' : ''}
              placeholder="请再次输入密码"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          
          {/* 用户角色 */}
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
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {isLoading ? '创建中...' : '创建用户'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              取消
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}