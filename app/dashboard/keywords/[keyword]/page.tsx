import { Suspense } from 'react'
import { Metadata } from 'next'
import { requirePermission } from '@/lib/auth-context'
import { KeywordAnalysisView } from '@/components/keywords/keyword-analysis-view'
import { getKeywordAnalysis } from '@/lib/services/keyword.service'

interface PageProps {
  params: Promise<{
    keyword: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { keyword } = await params
  const decodedKeyword = decodeURIComponent(keyword)
  
  return {
    title: `${decodedKeyword} Keyword Traffic Analysis – Top Websites and Traffic Stats`,
    description: `Analyze traffic data for ${decodedKeyword} keyword. View top ranking websites, traffic volume, growth rates, and registration dates.`
  }
}

export default async function KeywordAnalysisPage({ params }: PageProps) {
  await requirePermission('domains.view')
  
  const { keyword } = await params
  const decodedKeyword = decodeURIComponent(keyword)
  
  // 获取关键词分析数据
  const analysisData = await getKeywordAnalysis(decodedKeyword)
  
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<KeywordAnalysisLoading />}>
        <KeywordAnalysisView 
          keyword={decodedKeyword}
          data={analysisData}
        />
      </Suspense>
    </div>
  )
}

function KeywordAnalysisLoading() {
  return (
    <div className="animate-pulse">
      <div className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}