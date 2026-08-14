import type React from 'react'
import type { Page, Post } from '@/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, permanentRedirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

const LOCALE_PREFIX = /^\/(uz|ru|en|tg|kk)(?=\/|$)/

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((item) => item.from === url)

  if (redirectItem) {
    // 308, не 307: временный редирект не передаёт вес ссылки и не убирает
    // старый URL из индекса — правила из админки работали бы вхолостую.
    if (redirectItem.to?.url) {
      permanentRedirect(redirectItem.to.url)
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

      permanentRedirect(`${localePrefix}${collectionPrefix}/${slug}`)
    }
  }

  if (disableNotFound) return null

  notFound()
}
