import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DomainService } from '@/lib/services/domain.service'
import { requirePermission } from '@/lib/auth-context'
import { SimpleDomainDetail } from '@/components/domains/simple-domain-detail'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const domain = await DomainService.findById(id)
  
  if (!domain) {
    return {
      title: '域名不存在'
    }
  }
  
  return {
    title: `${domain.domain} - 域名详情`,
    description: `查看 ${domain.domain} 的详细分析数据`
  }
}

export default async function DomainDetailPage({ params }: PageProps) {
  await requirePermission('domains.view')
  
  const { id } = await params
  const domain = await DomainService.findById(id)
  
  if (!domain) {
    notFound()
  }
  
  return <SimpleDomainDetail domain={domain} />
}