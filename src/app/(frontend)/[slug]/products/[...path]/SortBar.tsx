'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowUpDown } from 'lucide-react'

type SortKey = '' | 'new' | 'title'

const SORT_OPTIONS: SortKey[] = ['', 'new', 'title']

type Props = {
  current: string
  total: number
}

export const SortBar: React.FC<Props> = ({ current, total }) => {
  const t = useTranslations('products')
  const router = useRouter()
  const pathname = usePathname()

  const setSort = (sort: SortKey) => {
    const params = new URLSearchParams()
    if (sort) params.set('sort', sort)
    router.push(`${pathname}${params.size ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border mb-6">
      <p className="text-sm text-muted-foreground">
        {t('foundProducts', { count: total })}
      </p>
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground shrink-0">{t('sortBy')}:</span>
        <div className="flex gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setSort(opt)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                current === opt
                  ? 'bg-primary text-white border-primary'
                  : 'border-border hover:border-primary bg-background text-foreground'
              }`}
            >
              {t(`sort.${opt || 'default'}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
