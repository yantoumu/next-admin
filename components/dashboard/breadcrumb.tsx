'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { BreadcrumbItem } from '@/lib/tabs-context'
import { memo } from 'react'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

const BreadcrumbComponent = function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500">
      {items.map((item, index) => (
        <div key={item.path} className="flex items-center">
          {index > 0 && (
            <ChevronRight size={14} className="mx-1 text-gray-400" />
          )}
          
          {index === items.length - 1 ? (
            // 当前页面，不可点击
            <span className="text-gray-900 font-medium">
              {item.title}
            </span>
          ) : (
            // 可点击的面包屑项
            <Link
              href={item.path}
              className="hover:text-gray-700 transition-colors"
            >
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

// 使用React.memo优化组件，只有items变化时才重新渲染
export const Breadcrumb = memo(BreadcrumbComponent)
