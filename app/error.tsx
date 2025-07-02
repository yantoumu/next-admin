'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 记录错误到监控服务
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 错误图标 */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
        </div>

        {/* 错误信息 */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            出现了一些问题
          </h1>
          <p className="text-gray-600">
            应用程序遇到了意外错误，我们正在努力修复
          </p>
        </div>

        {/* 错误详情（开发环境） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-lg p-4 text-left">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              错误详情 (开发模式)
            </h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {error.message}
            </pre>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                错误ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={reset}
            className="w-full flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            重试
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            返回首页
          </Button>
        </div>

        {/* 支持信息 */}
        <div className="text-xs text-gray-500 pt-4 border-t space-y-1">
          <p>如果问题持续存在，请联系技术支持</p>
          {error.digest && (
            <p>错误追踪ID: {error.digest}</p>
          )}
        </div>
      </div>
    </div>
  )
}