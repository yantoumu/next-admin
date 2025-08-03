'use client'

import { useEffect } from 'react'
import { DomainInfo } from '@prisma/client'

interface ExportHandlerProps {
  domains: DomainInfo[]
  type: 'csv' | 'excel'
  onComplete: () => void
}

export default function ExportHandler({ domains, type, onComplete }: ExportHandlerProps) {
  useEffect(() => {
    const exportData = async () => {
      try {
        if (type === 'csv') {
          await exportToCSV(domains)
        } else if (type === 'excel') {
          await exportToExcel(domains)
        }
        // 导出成功提示
        console.log(`导出成功：已导出 ${domains.length} 条域名数据`)
      } catch (error) {
        console.error('导出失败:', error)
        alert('导出失败，请稍后再试')
      } finally {
        onComplete()
      }
    }

    exportData()
  }, [domains, type, onComplete])

  return null
}

async function exportToCSV(domains: DomainInfo[]) {
  const headers = [
    '域名',
    '顶级域名',
    '注册日期',
    '到期日期',
    '注册商',
    '全球排名',
    '月访问量',
    '跳出率',
    '页面/访问',
    '平均访问时长(秒)',
    '直接流量%',
    '搜索流量%',
    '社交流量%',
    '引荐流量%',
    '分类',
    '国家代码',
    '国家排名',
  ]

  const rows = domains.map((domain) => [
    domain.domain,
    domain.tld || '',
    domain.registration_date ? new Date(domain.registration_date).toLocaleDateString() : '',
    domain.expiration_date ? new Date(domain.expiration_date).toLocaleDateString() : '',
    domain.registrar || '',
    domain.global_rank || '',
    domain.monthly_visits || '',
    domain.bounce_rate || '',
    domain.pages_per_visit || '',
    domain.avg_visit_duration || '',
    domain.traffic_direct || '',
    domain.traffic_search || '',
    domain.traffic_social || '',
    domain.traffic_referral || '',
    domain.category || '',
    domain.country_code || '',
    domain.country_rank || '',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  // 添加 BOM 以支持中文
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `domains_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function exportToExcel(domains: DomainInfo[]) {
  // 动态导入 xlsx 库以减少初始包大小
  const XLSX = await import('xlsx')

  const worksheet = XLSX.utils.json_to_sheet(
    domains.map((domain) => ({
      域名: domain.domain,
      顶级域名: domain.tld,
      注册日期: domain.registration_date,
      到期日期: domain.expiration_date,
      注册商: domain.registrar,
      全球排名: domain.global_rank,
      月访问量: Number(domain.monthly_visits || 0),
      跳出率: Number(domain.bounce_rate || 0),
      '页面/访问': Number(domain.pages_per_visit || 0),
      平均访问时长: domain.avg_visit_duration,
      直接流量百分比: Number(domain.traffic_direct || 0),
      搜索流量百分比: Number(domain.traffic_search || 0),
      社交流量百分比: Number(domain.traffic_social || 0),
      引荐流量百分比: Number(domain.traffic_referral || 0),
      分类: domain.category,
      国家代码: domain.country_code,
      国家排名: domain.country_rank,
      是否热门: domain.is_trending ? '是' : '否',
      是否成人内容: domain.is_adult ? '是' : '否',
      是否影视: domain.is_movie ? '是' : '否',
    }))
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '域名数据')

  // 设置列宽
  const colWidths = [
    { wch: 20 }, // 域名
    { wch: 10 }, // 顶级域名
    { wch: 12 }, // 注册日期
    { wch: 12 }, // 到期日期
    { wch: 20 }, // 注册商
    { wch: 10 }, // 全球排名
    { wch: 12 }, // 月访问量
    { wch: 10 }, // 跳出率
    { wch: 10 }, // 页面/访问
    { wch: 12 }, // 平均访问时长
    { wch: 12 }, // 直接流量
    { wch: 12 }, // 搜索流量
    { wch: 12 }, // 社交流量
    { wch: 12 }, // 引荐流量
    { wch: 15 }, // 分类
    { wch: 10 }, // 国家代码
    { wch: 10 }, // 国家排名
    { wch: 8 },  // 是否热门
    { wch: 10 }, // 是否成人内容
    { wch: 8 },  // 是否影视
  ]
  worksheet['!cols'] = colWidths

  XLSX.writeFile(workbook, `domains_${new Date().toISOString().split('T')[0]}.xlsx`)
}