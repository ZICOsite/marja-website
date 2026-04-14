'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { X, SlidersHorizontal } from 'lucide-react'

export type FilterAttr = {
  slug: string
  name: string
  unit: string | null
  values: string[]
}

type Props = {
  attrs: FilterAttr[]
  selected: string[] // tokens like "thickness:5mm"
  currentSort: string
}

export const AttributeFilters: React.FC<Props> = ({ attrs, selected, currentSort }) => {
  const t = useTranslations('products')
  const router = useRouter()
  const pathname = usePathname()

  if (attrs.length === 0) return null

  const buildUrl = (nextSelected: string[]) => {
    const params = new URLSearchParams()
    if (currentSort) params.set('sort', currentSort)
    nextSelected.forEach((v) => params.append('f', v))
    return `${pathname}${params.size ? `?${params.toString()}` : ''}`
  }

  const toggle = (token: string) => {
    const next = selected.includes(token)
      ? selected.filter((s) => s !== token)
      : [...selected, token]
    router.push(buildUrl(next))
  }

  const reset = () => router.push(buildUrl([]))

  return (
    <div className="rounded-2xl border border-border bg-background overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-sidebar-accent/40 flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {t('filters')}
        </h3>
        {selected.length > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" />
            {t('resetFilters')}
          </button>
        )}
      </div>

      <div className="p-3 space-y-5">
        {attrs.map((attr) => (
          <div key={attr.slug}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {attr.name}
              {attr.unit ? ` (${attr.unit})` : ''}
            </p>
            <div className="space-y-1.5">
              {attr.values.map((val) => {
                const token = `${attr.slug}:${val}`
                const checked = selected.includes(token)
                return (
                  <label
                    key={val}
                    className="flex items-center gap-2 cursor-pointer group select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(token)}
                      className="w-4 h-4 rounded border-border text-primary accent-primary focus:ring-primary/30 cursor-pointer"
                    />
                    <span
                      className={`text-sm transition-colors ${
                        checked
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground group-hover:text-foreground'
                      }`}
                    >
                      {val}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
