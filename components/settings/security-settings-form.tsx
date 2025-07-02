'use client'

import { useState } from 'react'
import { User } from '@/types/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Save, Shield, Lock, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

interface SecuritySettingsFormProps {
  currentUser: User
}

interface SecuritySettings {
  passwordMinLength: number
  passwordRequireUppercase: boolean
  passwordRequireLowercase: boolean
  passwordRequireNumbers: boolean
  passwordRequireSymbols: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  lockoutDuration: number
  enableTwoFactor: boolean
  allowPasswordReset: boolean
  requireEmailVerification: boolean
  allowMultipleSessions: boolean
}

interface FormErrors {
  passwordMinLength?: string
  sessionTimeout?: string
  maxLoginAttempts?: string
  lockoutDuration?: string
  general?: string
}

export function SecuritySettingsForm({ currentUser }: SecuritySettingsFormProps) {
  const [settings, setSettings] = useState<SecuritySettings>({
    passwordMinLength: 6,
    passwordRequireUppercase: false,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableTwoFactor: false,
    allowPasswordReset: true,
    requireEmailVerification: true,
    allowMultipleSessions: true
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const sessionTimeouts = [
    { value: 1, label: '1小时' },
    { value: 4, label: '4小时' },
    { value: 8, label: '8小时' },
    { value: 24, label: '24小时' },
    { value: 72, label: '3天' },
    { value: 168, label: '7天' }
  ]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (settings.passwordMinLength < 4 || settings.passwordMinLength > 128) {
      newErrors.passwordMinLength = '密码长度必须在4-128之间'
    }
    
    if (settings.sessionTimeout < 1 || settings.sessionTimeout > 720) {
      newErrors.sessionTimeout = '会话超时必须在1-720小时之间'
    }
    
    if (settings.maxLoginAttempts < 1 || settings.maxLoginAttempts > 100) {
      newErrors.maxLoginAttempts = '登录尝试次数必须在1-100之间'
    }
    
    if (settings.lockoutDuration < 1 || settings.lockoutDuration > 1440) {
      newErrors.lockoutDuration = '锁定时长必须在1-1440分钟之间'
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
      // TODO: 实现保存安全设置的API调用
      console.log('Saving security settings:', settings)
      // const response = await fetch('/api/settings/security', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })
      // if (!response.ok) throw new Error('Failed to save settings')
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('安全设置保存成功')
    } catch (error: any) {
      console.error('Save security settings error:', error)
      setErrors({ general: '保存失败，请稍后重试' })
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = () => {
    let strength = 0
    if (settings.passwordMinLength >= 8) strength++
    if (settings.passwordRequireUppercase) strength++
    if (settings.passwordRequireLowercase) strength++
    if (settings.passwordRequireNumbers) strength++
    if (settings.passwordRequireSymbols) strength++
    
    if (strength <= 2) return { level: '弱', color: 'text-red-600', bg: 'bg-red-100' }
    if (strength <= 3) return { level: '中', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: '强', color: 'text-green-600', bg: 'bg-green-100' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="space-y-6">
      {/* 全局错误 */}
      {errors.general && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4" />
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 密码策略 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              密码策略
            </CardTitle>
            <CardDescription>
              配置用户密码的安全要求
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength">最小密码长度</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  min="4"
                  max="128"
                  value={settings.passwordMinLength}
                  onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) || 6 })}
                  className={errors.passwordMinLength ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.passwordMinLength && (
                  <p className="text-sm text-red-500">{errors.passwordMinLength}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>密码强度级别</Label>
                <div className={`px-3 py-2 rounded-md border ${passwordStrength.bg}`}>
                  <span className={`text-sm font-medium ${passwordStrength.color}`}>
                    {passwordStrength.level}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>密码复杂度要求</Label>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireUppercase}
                    onChange={(e) => setSettings({ ...settings, passwordRequireUppercase: e.target.checked })}
                    className="rounded border-gray-300"
                    disabled={isLoading}
                  />
                  <span className="text-sm">包含大写字母</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireLowercase}
                    onChange={(e) => setSettings({ ...settings, passwordRequireLowercase: e.target.checked })}
                    className="rounded border-gray-300"
                    disabled={isLoading}
                  />
                  <span className="text-sm">包含小写字母</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireNumbers}
                    onChange={(e) => setSettings({ ...settings, passwordRequireNumbers: e.target.checked })}
                    className="rounded border-gray-300"
                    disabled={isLoading}
                  />
                  <span className="text-sm">包含数字</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireSymbols}
                    onChange={(e) => setSettings({ ...settings, passwordRequireSymbols: e.target.checked })}
                    className="rounded border-gray-300"
                    disabled={isLoading}
                  />
                  <span className="text-sm">包含特殊字符</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 会话管理 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              会话管理
            </CardTitle>
            <CardDescription>
              配置用户会话的安全策略
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">会话超时时间</Label>
                <Select 
                  value={settings.sessionTimeout.toString()} 
                  onValueChange={(value) => setSettings({ ...settings, sessionTimeout: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择超时时间" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionTimeouts.map((timeout) => (
                      <SelectItem key={timeout.value} value={timeout.value.toString()}>
                        {timeout.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>会话选项</Label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.allowMultipleSessions}
                    onChange={(e) => setSettings({ ...settings, allowMultipleSessions: e.target.checked })}
                    className="rounded border-gray-300"
                    disabled={isLoading}
                  />
                  <span className="text-sm">允许多设备同时登录</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 登录安全 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              登录安全
            </CardTitle>
            <CardDescription>
              配置登录失败和账户锁定策略
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">最大登录尝试次数</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) || 5 })}
                  className={errors.maxLoginAttempts ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.maxLoginAttempts && (
                  <p className="text-sm text-red-500">{errors.maxLoginAttempts}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lockoutDuration">账户锁定时长 (分钟)</Label>
                <Input
                  id="lockoutDuration"
                  type="number"
                  min="1"
                  max="1440"
                  value={settings.lockoutDuration}
                  onChange={(e) => setSettings({ ...settings, lockoutDuration: parseInt(e.target.value) || 15 })}
                  className={errors.lockoutDuration ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.lockoutDuration && (
                  <p className="text-sm text-red-500">{errors.lockoutDuration}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 高级安全 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              高级安全功能
            </CardTitle>
            <CardDescription>
              启用额外的安全保护措施
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.enableTwoFactor}
                  onChange={(e) => setSettings({ ...settings, enableTwoFactor: e.target.checked })}
                  className="rounded border-gray-300"
                  disabled={isLoading}
                />
                <div>
                  <span className="text-sm font-medium">启用双因子认证</span>
                  <p className="text-xs text-gray-500">要求用户使用第二种验证方式</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                  className="rounded border-gray-300"
                  disabled={isLoading}
                />
                <div>
                  <span className="text-sm font-medium">要求邮箱验证</span>
                  <p className="text-xs text-gray-500">新用户必须验证邮箱</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.allowPasswordReset}
                  onChange={(e) => setSettings({ ...settings, allowPasswordReset: e.target.checked })}
                  className="rounded border-gray-300"
                  disabled={isLoading}
                />
                <div>
                  <span className="text-sm font-medium">允许密码重置</span>
                  <p className="text-xs text-gray-500">用户可以通过邮箱重置密码</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? '保存中...' : '保存设置'}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setSettings({
                passwordMinLength: 6,
                passwordRequireUppercase: false,
                passwordRequireLowercase: true,
                passwordRequireNumbers: true,
                passwordRequireSymbols: false,
                sessionTimeout: 24,
                maxLoginAttempts: 5,
                lockoutDuration: 15,
                enableTwoFactor: false,
                allowPasswordReset: true,
                requireEmailVerification: true,
                allowMultipleSessions: true
              })
              setErrors({})
            }}
            disabled={isLoading}
          >
            重置
          </Button>
        </div>
      </form>
    </div>
  )
}