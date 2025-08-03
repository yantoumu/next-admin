'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function DomainError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 记录错误到错误报告服务
    console.error('Domain page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>出错了</CardTitle>
          </div>
          <CardDescription>
            加载域名数据时遇到问题
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-800">
              {error.message || '获取域名列表失败，请稍后重试'}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">可能的解决方案：</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>检查您的网络连接</li>
              <li>刷新页面重试</li>
              <li>如果问题持续，请联系管理员</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => reset()}
              className="flex-1"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1"
              variant="outline"
            >
              返回首页
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}