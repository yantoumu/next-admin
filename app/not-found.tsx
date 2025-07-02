'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PAGE_ROUTES } from '@/lib/constants'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 数字 */}
        <div className="space-y-4">
          <div className="text-6xl font-bold text-gray-300">
            404
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            页面未找到
          </h1>
          <p className="text-gray-600">
            抱歉，您访问的页面不存在或已被移动
          </p>
        </div>

        {/* 插图 */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-16 w-16 text-gray-400" />
          </div>
        </div>

        {/* 建议 */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            可能的原因：
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 网址输入错误</li>
            <li>• 页面已被删除或移动</li>
            <li>• 您没有访问权限</li>
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
        </div>

        {/* 联系信息 */}
        <div className="text-xs text-gray-500 pt-4 border-t">
          如果问题持续存在，请联系系统管理员
        </div>
      </div>
    </div>
  )
}