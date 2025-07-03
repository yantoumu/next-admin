'use client'

import { useState } from 'react'
import { User } from '@/types/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Save, Globe, Clock, Type, Image } from 'lucide-react'

interface GeneralSettingsFormProps {
  currentUser: User
}

interface GeneralSettings {
  systemName: string
  systemDescription: string
  systemUrl: string
  timezone: string
  language: string
  dateFormat: string
  favicon: string
  logo: string
}

interface FormErrors {
  systemName?: string
  systemUrl?: string
  general?: string
}

export function GeneralSettingsForm({ currentUser }: GeneralSettingsFormProps) {
  const [settings, setSettings] = useState<GeneralSettings>({
    systemName: '管理后台',
    systemDescription: 'Next.js 15 管理系统',
    systemUrl: 'https://admin.example.com',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    dateFormat: 'YYYY-MM-DD',
    favicon: '/favicon.ico',
    logo: '/logo.png'
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const timezones = [
    { value: 'Asia/Shanghai', label: '中国标准时间 (UTC+8)' },
    { value: 'Asia/Tokyo', label: '日本标准时间 (UTC+9)' },
    { value: 'America/New_York', label: '美国东部时间 (UTC-5)' },
    { value: 'Europe/London', label: '格林威治时间 (UTC+0)' },
    { value: 'UTC', label: '协调世界时 (UTC)' }
  ]

  const languages = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'zh-TW', label: '繁体中文' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'ja-JP', label: '日本語' }
  ]

  const dateFormats = [
    { value: 'YYYY-MM-DD', label: '2024-01-01' },
    { value: 'DD/MM/YYYY', label: '01/01/2024' },
    { value: 'MM/DD/YYYY', label: '01/01/2024' },
    { value: 'DD-MM-YYYY', label: '01-01-2024' }
  ]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!settings.systemName.trim()) {
      newErrors.systemName = '请输入系统名称'
    }
    
    if (!settings.systemUrl.trim()) {
      newErrors.systemUrl = '请输入系统地址'
    } else if (!/^https?:\/\/.+/.test(settings.systemUrl)) {
      newErrors.systemUrl = '请输入有效的URL地址'
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
      // TODO: 实现保存通用设置的API调用
      console.log('Saving general settings:', settings)
      // const response = await fetch('/api/settings/general', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })
      // if (!response.ok) throw new Error('Failed to save settings')
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('通用设置保存成功')
    } catch (error: any) {
      console.error('Save settings error:', error)
      setErrors({ general: '保存失败，请稍后重试' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSettings({
      systemName: '管理后台',
      systemDescription: 'Next.js 15 管理系统',
      systemUrl: 'https://admin.example.com',
      timezone: 'Asia/Shanghai',
      language: 'zh-CN',
      dateFormat: 'YYYY-MM-DD',
      favicon: '/favicon.ico',
      logo: '/logo.png'
    })
    setErrors({})
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              基本信息
            </CardTitle>
            <CardDescription>
              配置系统的基本信息和标识
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="systemName">系统名称 *</Label>
                <Input
                  id="systemName"
                  value={settings.systemName}
                  onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                  className={errors.systemName ? 'border-red-500' : ''}
                  placeholder="请输入系统名称"
                  disabled={isLoading}
                />
                {errors.systemName && (
                  <p className="text-sm text-red-500">{errors.systemName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="systemUrl">系统地址 *</Label>
                <Input
                  id="systemUrl"
                  value={settings.systemUrl}
                  onChange={(e) => setSettings({ ...settings, systemUrl: e.target.value })}
                  className={errors.systemUrl ? 'border-red-500' : ''}
                  placeholder="https://admin.example.com"
                  disabled={isLoading}
                />
                {errors.systemUrl && (
                  <p className="text-sm text-red-500">{errors.systemUrl}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="systemDescription">系统描述</Label>
              <Input
                id="systemDescription"
                value={settings.systemDescription}
                onChange={(e) => setSettings({ ...settings, systemDescription: e.target.value })}
                placeholder="请输入系统描述"
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* 地区和语言 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              地区和语言
            </CardTitle>
            <CardDescription>
              配置时区、语言和日期格式
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezone">时区</Label>
                <Select 
                  value={settings.timezone} 
                  onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择时区" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">默认语言</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => setSettings({ ...settings, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFormat">日期格式</Label>
              <Select 
                value={settings.dateFormat} 
                onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择日期格式" />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 外观设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" aria-label="外观设置图标" />
              外观设置
            </CardTitle>
            <CardDescription>
              配置系统图标和品牌标识
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo地址</Label>
                <Input
                  id="logo"
                  value={settings.logo}
                  onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                  placeholder="/logo.png"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">建议尺寸: 120x40px</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="favicon">网站图标地址</Label>
                <Input
                  id="favicon"
                  value={settings.favicon}
                  onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                  placeholder="/favicon.ico"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">建议格式: .ico 或 .png</p>
              </div>
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
            onClick={handleReset}
            disabled={isLoading}
          >
            重置
          </Button>
        </div>
      </form>
    </div>
  )
}