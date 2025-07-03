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
    <div className="space-y-4 animate-fade-in">
      {backUrl && (
        <Link
          href={backUrl}
          className="inline-flex items-center text-body-small text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
          {backText || '返回'}
        </Link>
      )}

      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <h1 className="text-display text-foreground">{title}</h1>
          {description && (
            <p className="text-body text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        {action && <div className="animate-scale-in">{action}</div>}
      </div>
    </div>
  )
}