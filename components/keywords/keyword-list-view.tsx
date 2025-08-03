'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, TrendingUp, Globe, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface PopularKeyword {
  keyword: string
  totalVolume: number
  totalTraffic: number
  domainCount: number
}

interface KeywordListViewProps {
  keywords: PopularKeyword[]
}

export function KeywordListView({ keywords }: KeywordListViewProps) {
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState('')
  
  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toLocaleString()
  }

  // 处理搜索
  const handleSearch = () => {
    if (searchKeyword.trim()) {
      router.push(`/dashboard/keywords/${encodeURIComponent(searchKeyword.trim())}`)
    }
  }

  // 处理按键
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      {/* 搜索框 */}
      <Card>
        <CardHeader>
          <CardTitle>搜索关键词</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="输入关键词进行分析..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-12"
            />
            <Button 
              onClick={handleSearch}
              className="h-12 px-6"
              disabled={!searchKeyword.trim()}
            >
              <Search className="h-4 w-4 mr-2" />
              分析
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 热门关键词列表 */}
      <Card>
        <CardHeader>
          <CardTitle>热门关键词</CardTitle>
        </CardHeader>
        <CardContent>
          {keywords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无关键词数据
            </div>
          ) : (
            <div className="space-y-4">
              {keywords.map((keyword, index) => (
                <Link
                  key={keyword.keyword}
                  href={`/dashboard/keywords/${encodeURIComponent(keyword.keyword)}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="font-semibold text-blue-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{keyword.keyword}</h3>
                        <p className="text-sm text-gray-600">
                          {keyword.domainCount} 个网站
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Search className="h-4 w-4" />
                          <span className="text-sm">搜索量</span>
                        </div>
                        <p className="font-semibold">{formatNumber(keyword.totalVolume)}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">流量</span>
                        </div>
                        <p className="font-semibold">{formatNumber(keyword.totalTraffic)}</p>
                      </div>
                      
                      <TrendingUp className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}