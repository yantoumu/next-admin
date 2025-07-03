'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export interface Tab {
  id: string
  path: string
  title: string
  breadcrumbs: BreadcrumbItem[]
}

export interface BreadcrumbItem {
  title: string
  path: string
}

interface TabsContextType {
  tabs: Tab[]
  activeTabId: string
  addTab: (tab: Omit<Tab, 'id'>) => void
  removeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  getTabByPath: (path: string) => Tab | undefined
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

// 路径到标题的映射
const PATH_TITLES: Record<string, string> = {
  '/dashboard': '概览',
  '/dashboard/users': '用户列表',
  '/dashboard/users/create': '新建用户',
  '/dashboard/settings': '系统设置',
  '/dashboard/settings/general': '通用设置',
  '/dashboard/settings/security': '安全设置',
  '/dashboard/profile': '个人资料',
}

// 生成面包屑导航
function generateBreadcrumbs(path: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = []
  
  // 总是从首页开始
  breadcrumbs.push({ title: '首页', path: '/dashboard' })
  
  if (path === '/dashboard') {
    return breadcrumbs
  }
  
  // 解析路径段
  const segments = path.split('/').filter(Boolean)
  let currentPath = ''
  
  for (let i = 0; i < segments.length; i++) {
    currentPath += '/' + segments[i]
    
    // 跳过 'dashboard' 段，因为已经添加了首页
    if (segments[i] === 'dashboard') {
      continue
    }
    
    const title = PATH_TITLES[currentPath]
    if (title) {
      breadcrumbs.push({ title, path: currentPath })
    }
  }
  
  return breadcrumbs
}

// 生成标签页标题
function generateTabTitle(path: string): string {
  return PATH_TITLES[path] || '未知页面'
}

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('')
  const pathname = usePathname()
  const router = useRouter()

  // 生成唯一ID
  const generateTabId = (path: string) => `tab-${path.replace(/\//g, '-')}`

  // 添加标签页（保留接口兼容性，但内部使用统一逻辑）
  const addTab = (tabData: Omit<Tab, 'id'>) => {
    const id = generateTabId(tabData.path)

    setTabs(prevTabs => {
      const existingTab = prevTabs.find(tab => tab.path === tabData.path)

      if (existingTab) {
        setActiveTabId(existingTab.id)
        return prevTabs
      } else {
        const newTab: Tab = { ...tabData, id }
        setActiveTabId(id)
        return [...prevTabs, newTab]
      }
    })
  }

  // 移除标签页
  const removeTab = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId)
      
      // 如果删除的是当前活跃标签，切换到最后一个标签
      if (tabId === activeTabId && newTabs.length > 0) {
        const lastTab = newTabs[newTabs.length - 1]
        setActiveTabId(lastTab.id)
        router.push(lastTab.path)
      }
      
      return newTabs
    })
  }

  // 设置活跃标签
  const setActiveTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab) {
      setActiveTabId(tabId)
      router.push(tab.path)
    }
  }

  // 根据路径获取标签
  const getTabByPath = (path: string): Tab | undefined => {
    return tabs.find(tab => tab.path === path)
  }

  // 统一的标签管理：监听路径变化，自动添加/切换标签
  useEffect(() => {
    if (!pathname.startsWith('/dashboard')) return

    const breadcrumbs = generateBreadcrumbs(pathname)
    const title = generateTabTitle(pathname)
    const tabId = generateTabId(pathname)

    // 使用函数式更新确保状态一致性
    setTabs(prevTabs => {
      // 检查标签是否已存在
      const existingTab = prevTabs.find(tab => tab.path === pathname)

      if (existingTab) {
        // 标签已存在，不添加新标签
        setActiveTabId(existingTab.id)
        return prevTabs
      } else {
        // 添加新标签
        const newTab: Tab = {
          id: tabId,
          path: pathname,
          title,
          breadcrumbs
        }
        setActiveTabId(tabId)
        return [...prevTabs, newTab]
      }
    })
  }, [pathname])

  const value: TabsContextType = {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    setActiveTab,
    getTabByPath
  }

  return (
    <TabsContext.Provider value={value}>
      {children}
    </TabsContext.Provider>
  )
}

export function useTabs() {
  const context = useContext(TabsContext)
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider')
  }
  return context
}
