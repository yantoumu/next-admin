'use client'

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
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

// 缓存面包屑生成结果，避免重复计算
const breadcrumbsCache = new Map<string, BreadcrumbItem[]>()

// 生成面包屑导航（带缓存优化）
function generateBreadcrumbs(path: string): BreadcrumbItem[] {
  // 检查缓存
  if (breadcrumbsCache.has(path)) {
    return breadcrumbsCache.get(path)!
  }

  const breadcrumbs: BreadcrumbItem[] = []

  // 总是从首页开始
  breadcrumbs.push({ title: '首页', path: '/dashboard' })

  if (path === '/dashboard') {
    breadcrumbsCache.set(path, breadcrumbs)
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

  // 缓存结果
  breadcrumbsCache.set(path, breadcrumbs)
  return breadcrumbs
}

// 生成标签页标题（带缓存优化）
const titleCache = new Map<string, string>()
function generateTabTitle(path: string): string {
  if (titleCache.has(path)) {
    return titleCache.get(path)!
  }

  const title = PATH_TITLES[path] || '未知页面'
  titleCache.set(path, title)
  return title
}

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('')
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // 生成唯一ID
  const generateTabId = (path: string) => `tab-${path.replace(/\//g, '-')}`

  // 缓存添加标签页函数，避免重新创建
  const addTab = useCallback((tabData: Omit<Tab, 'id'>) => {
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
  }, [])

  // 缓存移除标签页函数 - 分离状态更新和路由导航
  const removeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId)

      // 如果删除的是当前活跃标签，切换到最后一个标签
      if (tabId === activeTabId && newTabs.length > 0) {
        const lastTab = newTabs[newTabs.length - 1]
        setActiveTabId(lastTab.id)
        // 设置待导航路径，在useEffect中处理
        setPendingNavigation(lastTab.path)
      }

      return newTabs
    })
  }, [activeTabId])

  // 缓存设置活跃标签函数
  const setActiveTab = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab) {
      setActiveTabId(tabId)
      router.push(tab.path)
    }
  }, [tabs, router])

  // 缓存根据路径获取标签函数
  const getTabByPath = useCallback((path: string): Tab | undefined => {
    return tabs.find(tab => tab.path === path)
  }, [tabs])

  // 处理异步路由导航，避免渲染期间状态更新冲突
  useEffect(() => {
    if (pendingNavigation) {
      // 使用setTimeout确保在下一个事件循环中执行
      const timeoutId = setTimeout(() => {
        router.push(pendingNavigation)
        setPendingNavigation(null)
      }, 0)

      return () => clearTimeout(timeoutId)
    }
  }, [pendingNavigation, router])

  // 缓存标签数据生成，避免重复计算
  const tabData = useMemo(() => {
    if (!pathname.startsWith('/dashboard')) return null

    return {
      breadcrumbs: generateBreadcrumbs(pathname),
      title: generateTabTitle(pathname),
      tabId: generateTabId(pathname)
    }
  }, [pathname])

  // 统一的标签管理：监听路径变化，自动添加/切换标签
  useEffect(() => {
    if (!tabData) return

    const { breadcrumbs, title, tabId } = tabData

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
  }, [tabData, pathname])

  // 缓存context value，避免不必要的重新渲染
  const value: TabsContextType = useMemo(() => ({
    tabs,
    activeTabId,
    addTab,
    removeTab,
    setActiveTab,
    getTabByPath
  }), [tabs, activeTabId, addTab, removeTab, setActiveTab, getTabByPath])

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
