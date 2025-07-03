'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// Import removed - will use API routes instead
import { PAGE_ROUTES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Mail, Lock, Github } from 'lucide-react'

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123456')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!email.trim()) {
      newErrors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }
    
    if (!password.trim()) {
      newErrors.password = '请输入密码'
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      router.push(PAGE_ROUTES.DASHBOARD)
    } catch (error: any) {
      console.error('Login error:', error)
      setErrors({ 
        general: error.message === 'Invalid login credentials' 
          ? '邮箱或密码错误' 
          : '登录失败，请稍后重试' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github' | 'twitter') => {
    setIsLoading(true)
    setErrors({})
    
    try {
      // TODO: 实现OAuth登录
      console.log(`OAuth ${provider} login attempt`)
      // OAuth登录会自动重定向
      setErrors({ general: `${provider} 登录功能即将开放` })
    } catch (error: any) {
      console.error(`OAuth ${provider} login error:`, error)
      setErrors({ general: `${provider} 登录失败，请稍后重试` })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email.trim()) {
      setErrors({ email: '请先输入邮箱地址' })
      return
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: '请输入有效的邮箱地址' })
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      // TODO: 实现魔术链接登录
      console.log('Magic link request for:', email)
      // await loginWithMagicLink(email)
      setIsMagicLinkSent(true)
    } catch (error: any) {
      console.error('Magic link error:', error)
      setErrors({ general: '发送登录链接失败，请稍后重试' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isMagicLinkSent) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Mail className="h-5 w-5" />
            登录链接已发送
          </CardTitle>
          <CardDescription>
            我们已将登录链接发送到 {email}，请检查您的邮箱
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setIsMagicLinkSent(false)}
          >
            返回登录
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription>
          使用您的账户信息登录系统
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 全局错误 */}
        {errors.general && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4" />
            {errors.general}
          </div>
        )}

        {/* 邮箱密码登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
              placeholder="请输入邮箱地址"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'border-red-500' : ''}
              placeholder="请输入密码"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-gray-300"
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="text-sm">
              记住我
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            <Lock className="h-4 w-4 mr-2" />
            {isLoading ? '登录中...' : '登录'}
          </Button>
        </form>

        {/* 注释掉未实现的登录方式
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              或者
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin('google')}
            disabled={isLoading}
            className="w-full"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>

          <Button
            variant="outline"
            onClick={() => handleOAuthLogin('github')}
            disabled={isLoading}
            className="w-full"
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={handleMagicLink}
          disabled={isLoading}
          className="w-full"
        >
          <Mail className="h-4 w-4 mr-2" />
          使用邮箱登录链接
        </Button>
        */}
      </CardContent>
    </Card>
  )
}