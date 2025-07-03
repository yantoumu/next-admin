import { redirect } from 'next/navigation'
import { getCurrentUserServer } from '@/lib/auth'

/**
 * 主页 - 智能重定向
 * 已登录用户：重定向到Dashboard
 * 未登录用户：重定向到登录页面
 * 这是一个管理系统，不需要公开的首页
 */
export default async function Home() {
  // 检查用户是否已登录
  const user = await getCurrentUserServer()

  if (user) {
    // 已登录，重定向到Dashboard
    redirect('/dashboard')
  } else {
    // 未登录，重定向到登录页面
    redirect('/login')
  }
}