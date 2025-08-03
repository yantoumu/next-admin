'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  className 
}: MetricCardProps) {
  return (
    <div className={cn(
      "rounded-md bg-slate-50 p-3 md:p-4",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 text-nowrap">
            <Icon className="h-4 w-4 text-primary" />
            {title}
          </p>
          <div className="font-semibold mt-2 text-base md:text-xl flex items-center gap-2">
            {value}
            {change && (
              <span className={cn(
                "ml-1.5 text-sm",
                change.type === 'increase' && "text-green-500",
                change.type === 'decrease' && "text-red-500",
                change.type === 'neutral' && "text-gray-500"
              )}>
                {change.value}
              </span>
            )}
          </div>
        </div>
        <div className="hidden md:flex h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  )
}
