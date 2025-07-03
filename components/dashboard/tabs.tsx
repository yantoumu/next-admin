'use client'

import { X } from 'lucide-react'
import { useTabs } from '@/lib/tabs-context'

export function Tabs() {
  const { tabs, activeTabId, setActiveTab, removeTab } = useTabs()

  if (tabs.length === 0) return null

  return (
    <div className="flex items-center space-x-1 mt-3 border-b border-gray-200">
      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId
          
          return (
            <div
              key={tab.id}
              className={`flex items-center group relative min-w-0 ${
                isActive
                  ? 'bg-white border-t border-l border-r border-gray-200 -mb-px'
                  : 'bg-gray-50 hover:bg-gray-100'
              } rounded-t-md transition-colors`}
            >
              {/* 标签内容 */}
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 text-sm font-medium transition-colors min-w-0 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="truncate max-w-32">
                  {tab.title}
                </span>
              </button>
              
              {/* 关闭按钮 */}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeTab(tab.id)
                  }}
                  className={`p-1 rounded-full transition-colors ml-1 mr-2 ${
                    isActive
                      ? 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                      : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'
                  } opacity-0 group-hover:opacity-100`}
                  title="关闭标签"
                >
                  <X size={14} />
                </button>
              )}
              
              {/* 活跃标签指示器 */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
