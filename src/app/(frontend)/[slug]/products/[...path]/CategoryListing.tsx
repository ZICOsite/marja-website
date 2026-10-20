'use client'

import React, { useCallback, useMemo, useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'

import { SortBar } from './SortBar'
import { AttributeFilters, type FilterAttr } from './AttributeFilters'

// Сортировка и фильтры работают в браузере: сервер отдаёт полный список
// категории (порядок по умолчанию) один раз, и страница кэшируется (ISR).
// Раньше каждое ?sort=/?f= рендерилось на сервере → вся категория была
// force-dynamic и не кэшировалась. Формат URL (?sort=..&f=..) сохранён,
// ссылки с фильтрами продолжают работать.

export type ListingItem = {
  id: string
  node: React.ReactNode // отрендеренная на сервере карточка товара
  title: string
  price: number | null
  publishedAt: string | null
  filterTokens: string[] // "thickness:5mm"
}

type Props = {
  items: ListingItem[]
  attrs: FilterAttr[]
  sidebarBefore?: React.ReactNode
  sidebarAfter?: React.ReactNode
  emptyContent: React.ReactNode // когда в категории нет товаров (подкатегории / «нет товаров»)
}

type UrlState = { sort: string; filters: string[] }

// Строка запроса — «внешнее хранилище»: подписка на назад/вперёд и на наши
// собственные изменения. На сервере и при гидратации — пустая строка
// (порядок по умолчанию), затем React сам подставит реальный URL.
const URL_EVENT = 'catalog-url-change'
const subscribe = (cb: () => void) => {
  window.addEventListener('popstate', cb)
  window.addEventListener(URL_EVENT, cb)
  return () => {
    window.removeEventListener('popstate', cb)
    window.removeEventListener(URL_EVENT, cb)
  }
}
const getSearch = () => window.location.search
const getServerSearch = () => ''

const parse = (search: string): UrlState => {
  const p = new URLSearchParams(search)
  return { sort: p.get('sort') ?? '', filters: p.getAll('f') }
}

const writeUrl = ({ sort, filters }: UrlState) => {
  const p = new URLSearchParams(window.location.search)
  p.delete('sort')
  p.delete('f')
  if (sort) p.set('sort', sort)
  filters.forEach((v) => p.append('f', v))
  const qs = p.toString()
  window.history.pushState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`)
  window.dispatchEvent(new Event(URL_EVENT))
}

// Как в Postgres: ASC — пустые цены в конце, DESC — в начале.
const cmpPrice = (a: number | null, b: number | null, dir: 1 | -1) => {
  if (a == null && b == null) return 0
  if (a == null) return dir === 1 ? 1 : -1
  if (b == null) return dir === 1 ? -1 : 1
  return (a - b) * dir
}

export const CategoryListing: React.FC<Props> = ({
  items,
  attrs,
  sidebarBefore,
  sidebarAfter,
  emptyContent,
}) => {
  const t = useTranslations('products')
  // Первый рендер (и HTML для поисковиков) — без фильтров, порядок по умолчанию.
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch)
  const state = useMemo(() => parse(search), [search])

  const update = useCallback((next: UrlState) => writeUrl(next), [])

  const visible = useMemo(() => {
    const bySlug = new Map<string, string[]>()
    for (const token of state.filters) {
      const i = token.indexOf(':')
      if (i === -1) continue
      const slug = token.slice(0, i)
      if (!bySlug.has(slug)) bySlug.set(slug, [])
      bySlug.get(slug)!.push(token)
    }
    // AND между атрибутами, OR внутри одного атрибута
    const filtered =
      bySlug.size === 0
        ? items
        : items.filter((it) => {
            const own = new Set(it.filterTokens)
            return Array.from(bySlug.values()).every((tokens) => tokens.some((x) => own.has(x)))
          })

    const sorted = [...filtered]
    switch (state.sort) {
      case 'new':
        sorted.sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
        break
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'price_asc':
        sorted.sort((a, b) => cmpPrice(a.price, b.price, 1))
        break
      case 'price_desc':
        sorted.sort((a, b) => cmpPrice(a.price, b.price, -1))
        break
    }
    return sorted
  }, [items, state])

  const hasProducts = items.length > 0

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
        {sidebarBefore}
        {hasProducts && (
          <AttributeFilters
            attrs={attrs}
            selected={state.filters}
            onChange={(filters) => update({ ...state, filters })}
          />
        )}
        {sidebarAfter}
      </div>

      <div className="flex-1 min-w-0">
        {hasProducts ? (
          <>
            <SortBar
              current={state.sort}
              total={visible.length}
              onChange={(sort) => update({ ...state, sort })}
            />
            {visible.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {visible.map((it) => (
                  <React.Fragment key={it.id}>{it.node}</React.Fragment>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-muted-foreground">{t('noProducts')}</div>
            )}
          </>
        ) : (
          emptyContent
        )}
      </div>
    </div>
  )
}
