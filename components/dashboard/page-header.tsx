import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  backUrl?: string
  backText?: string
}

export function PageHeader({ title, description, action, backUrl, backText }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      {backUrl && (
        <Link 
          href={backUrl}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {backText || '返回'}
        </Link>
      )}
      
      <div className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}