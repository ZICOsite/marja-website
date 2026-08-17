import type React from 'react'
import type { Page, Post } from '@/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, permanentRedirect } from 'next/navigation'

type SearchParams = Record<string, string | string[] | undefined>

interface Props {
  disableNotFound?: boolean
  searchParams?: SearchParams
  url: string
}

const LOCALE_PREFIX = /^\/(uz|ru|en|tg|kk)(?=\/|$)/

// Редирект обязан донести query-строку до цели: в ней приезжают рекламные
// метки (gclid, utm_*). Потеряв их, платный переход попадает в аналитику как
// прямой, и заявка не привязывается к кампании. Правила из redirects.js
// склеивает сам Next, здесь цель берётся из базы — склеиваем руками.
const withSearch = (target: string, searchParams?: SearchParams): string => {
  if (!searchParams) return target

  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item))
    } else if (typeof value === 'string') {
      params.append(key, value)
    }
  }

  const search = params.toString()

  if (!search) return target

  return `${target}${target.includes('?') ? '&' : '?'}${search}`
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({
  disableNotFound,
  searchParams,
  url,
}) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((item) => item.from === url)

  if (redirectItem) {
    // 308, не 307: временный редирект не передаёт вес ссылки и не убирает
    // старый URL из индекса — правила из админки работали бы вхолостую.
    if (redirectItem.to?.url) {
      permanentRedirect(withSearch(redirectItem.to.url, searchParams))
    }

    const reference = redirectItem.to?.reference
    const relationTo = reference?.relationTo

    let slug: string | undefined

    if (typeof reference?.value === 'string' && relationTo) {
      const document = (await getCachedDocument(relationTo, reference.value)()) as Page | Post
      slug = document?.slug ?? undefined
    } else if (reference?.value && typeof reference.value === 'object') {
      slug = (reference.value as Page | Post).slug ?? undefined
    }

    if (slug) {
      // Сайт мультиязычный: префикс локали из исходного URL нужно сохранить,
      // иначе любой редирект по ссылке на документ уводил бы на /uz.
      const localePrefix = url.match(LOCALE_PREFIX)?.[0] ?? ''
      const collectionPrefix = relationTo && relationTo !== 'pages' ? `/${relationTo}` : ''

      permanentRedirect(withSearch(`${localePrefix}${collectionPrefix}/${slug}`, searchParams))
    }
  }

  if (disableNotFound) return null

  notFound()
}
