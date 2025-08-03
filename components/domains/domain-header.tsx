'use client'

import { SquareArrowOutUpRight } from 'lucide-react'
import Link from 'next/link'

interface DomainHeaderProps {
  domain: string
  title?: string
  description?: string
  showViewDetails?: boolean
}

export function DomainHeader({ 
  domain, 
  title, 
  description = "Loading description...",
  showViewDetails = false 
}: DomainHeaderProps) {
  // 构建完整的URL
  const fullUrl = domain.startsWith('http') ? domain : `https://${domain}`
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between">
      <div>
        <div className="flex items-center gap-0.5 text-2xl font-bold">
          <h2 className="pb-1.5">{domain}</h2>
          <a 
            href={fullUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1.5 p-1.5 text-foreground flex items-center justify-center hover:bg-gray-100 rounded-md"
          >
            <SquareArrowOutUpRight className="h-4 w-4 text-muted-foreground hover:text-primary transition-all duration-200" />
          </a>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {title || description}
        </p>
      </div>
      {showViewDetails && (
        <Link 
          href={`/${domain}`}
          className="w-full md:w-auto mt-3 md:mt-0 bg-primary/10 sm:w-auto sm:bg-transparent rounded-md p-2 text-sm text-primary transition-all duration-200 min-w-30 text-center sm:text-right"
        >
          View Details
        </Link>
      )}
    </div>
  )
}
