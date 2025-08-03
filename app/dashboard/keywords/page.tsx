import { Metadata } from 'next'
import { requirePermission } from '@/lib/auth-context'
import { getPopularKeywords } from '@/lib/services/keyword.service'
import { KeywordListView } from '@/components/keywords/keyword-list-view'

export const metadata: Metadata = {
  title: '关键词分析 | 站找词',
  description: '分析热门关键词的流量数据和网站排名'
}

export default async function KeywordsPage() {
  await requirePermission('domains.view')
  
  const popularKeywords = await getPopularKeywords(50)
  
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">关键词分析</h1>
          <p className="text-sm text-gray-600 mt-1">探索热门关键词的流量数据和网站排名</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <KeywordListView keywords={popularKeywords} />
      </div>
    </div>
  )
}