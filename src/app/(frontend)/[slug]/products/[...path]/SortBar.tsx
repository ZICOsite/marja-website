'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Funnel } from 'lucide-react'
import { cn } from '@/utilities/ui'

type SortKey = '' | 'new' | 'price_asc' | 'price_desc'

const SORT_OPTIONS: SortKey[] = ['', 'new', 'price_asc', 'price_desc']

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

  const currentSort = (SORT_OPTIONS.includes(current as SortKey) ? current : '') as SortKey

  return (
    <div className="flex items-center justify-between gap-3 pb-4 border-b border-border mb-6">
      <p className="text-sm text-muted-foreground">
        {t('foundProducts', { count: total })}
      </p>

      <div className="flex items-center gap-2">
        <Funnel className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground shrink-0">{t('sortBy')}:</span>

        {/* Mobile: native select */}
        <select
          value={currentSort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="md:hidden h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {t(`sort.${opt || 'default'}`)}
            </option>
          ))}
        </select>

        {/* Desktop: pill buttons */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl border border-border bg-sidebar-accent/40">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setSort(opt)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg transition-all duration-150 cursor-pointer',
                currentSort === opt
                  ? 'bg-background text-foreground font-medium shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t(`sort.${opt || 'default'}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
