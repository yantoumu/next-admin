'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { DomainInfo } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// 动态导入导出功能，实现代码分割
const ExportHandler = dynamic(() => import('./domain-export-handler'), {
  loading: () => <span className="text-sm">加载中...</span>,
})

interface DomainExportButtonProps {
  domains: DomainInfo[]
}

export function DomainExportButton({ domains }: DomainExportButtonProps) {
  const [exportType, setExportType] = useState<'csv' | 'excel' | null>(null)

  const handleExport = (type: 'csv' | 'excel') => {
    setExportType(type)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            导出数据
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport('csv')}>
            导出为 CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('excel')}>
            导出为 Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {exportType && (
        <ExportHandler
          domains={domains}
          type={exportType}
          onComplete={() => setExportType(null)}
        />
      )}
    </>
  )
}