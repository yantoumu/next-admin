'use client'

import { useState } from 'react'
import { User, ROLE_DISPLAY_NAMES } from '@/types/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Save, User as UserIcon, Lock, Mail } from 'lucide-react'

interface ProfileFormProps {
  user: User
}

interface ProfileData {
  name: string
  email: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
  general?: string
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user.name || '',
    email: user.email
  })
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const validateProfileForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!profileData.name.trim()) {
      newErrors.name = '请输入姓名'
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = '请输入当前密码'
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = '请输入新密码'
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = '新密码至少需要6位字符'
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = '请确认新密码'
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateProfileForm()) {
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      // TODO: 实现更新个人信息的API调用
      console.log('Updating profile:', profileData)
      // await updateProfile(profileData)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('个人信息更新成功')
    } catch (error: any) {
      console.error('Profile update error:', error)
      setErrors({ general: '更新失败，请稍后重试' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) {
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      // TODO: 实现更改密码的API调用
      console.log('Changing password')
      // await changePassword(passwordData.currentPassword, passwordData.newPassword)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 重置密码表单
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswordForm(false)
      
      alert('密码更改成功')
    } catch (error: any) {
      console.error('Password change error:', error)
      
      if (error.message?.includes('Invalid password')) {
        setErrors({ currentPassword: '当前密码错误' })
      } else {
        setErrors({ general: '密码更改失败，请稍后重试' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeVariant = (role: User['role']) => {
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

  return (
    <div className="space-y-6">
      {/* 全局错误 */}
      {errors.general && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4" />
          {errors.general}
        </div>
      )}

      {/* 个人信息表单 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            基本信息
          </CardTitle>
          <CardDescription>
            更新您的个人基本信息
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* 用户头像区域 */}
            <div className="flex items-center space-x-4 pb-4 border-b">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-medium">{user.name || '未设置姓名'}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {ROLE_DISPLAY_NAMES[user.role]}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* 姓名 */}
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
                placeholder="请输入您的姓名"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            {/* 邮箱 */}
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="请输入邮箱地址"
                  disabled={true} // 邮箱通常不允许修改
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
              <p className="text-xs text-gray-500">邮箱地址用于登录，如需修改请联系管理员</p>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? '保存中...' : '保存更改'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 密码更改 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            密码安全
          </CardTitle>
          <CardDescription>
            定期更改密码以保护账户安全
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!showPasswordForm ? (
            <Button
              onClick={() => setShowPasswordForm(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              更改密码
            </Button>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* 当前密码 */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">当前密码</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className={errors.currentPassword ? 'border-red-500' : ''}
                  placeholder="请输入当前密码"
                  disabled={isLoading}
                />
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">{errors.currentPassword}</p>
                )}
              </div>
              
              {/* 新密码 */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">新密码</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className={errors.newPassword ? 'border-red-500' : ''}
                  placeholder="请输入新密码（至少6位）"
                  disabled={isLoading}
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>
              
              {/* 确认新密码 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认新密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                  placeholder="请再次输入新密码"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? '更改中...' : '更改密码'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowPasswordForm(false)
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    })
                    setErrors({})
                  }}
                  disabled={isLoading}
                >
                  取消
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}