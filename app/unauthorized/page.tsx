'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PAGE_ROUTES } from '@/lib/constants'
import { Shield, Home, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 403 数字 */}
        <div className="space-y-4">
          <div className="text-6xl font-bold text-gray-300">
            403
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            访问被拒绝
          </h1>
          <p className="text-gray-600">
            抱歉，您没有权限访问此页面
          </p>
        </div>

        {/* 权限图标 */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-yellow-50 rounded-full flex items-center justify-center">
            <Shield className="h-16 w-16 text-yellow-500" />
          </div>
        </div>

        {/* 说明 */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            可能的原因：
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 您的账户权限不足</li>
            <li>• 页面需要特定角色访问</li>
            <li>• 会话已过期，请重新登录</li>
          </ul>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col space-y-3">
          <Link href={PAGE_ROUTES.DASHBOARD}>
            <Button className="w-full flex items-center gap-2">
              <Home className="h-4 w-4" />
              返回首页
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回上页
          </Button>
          
          <Link href={PAGE_ROUTES.LOGIN}>
            <Button 
              variant="ghost" 
              className="w-full"
            >
              重新登录
            </Button>
          </Link>
        </div>

        {/* 联系信息 */}
        <div className="text-xs text-gray-500 pt-4 border-t">
          如需更高权限，请联系系统管理员
        </div>
      </div>
    </div>
  )
}