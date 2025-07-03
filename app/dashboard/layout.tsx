import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client'
import { requireAuth } from '@/lib/auth-middleware'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>
}