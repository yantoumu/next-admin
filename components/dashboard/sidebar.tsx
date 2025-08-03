import { User } from '@/types/auth'
import { SidebarClient } from './sidebar-client'

interface SidebarProps {
  user: User
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

// 服务端组件，只负责传递 props
export function Sidebar(props: SidebarProps) {
  return <SidebarClient {...props} />
}