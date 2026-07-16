import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { locales } from '@/i18n/routing'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/og-default.jpg'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

// path — путь без локали, например '/about' или '/posts/my-post' или '' для главной
export const buildAlternates = (locale: string, path: string): NonNullable<Metadata['alternates']> => {
  const serverUrl = getServerSideURL()
  const languages: Record<string, string> = {}

  for (const loc of locales) {
    languages[loc] = `${serverUrl}/${loc}${path}`
  }
  languages['x-default'] = `${serverUrl}/uz${path}`

  return {
    canonical: `${serverUrl}/${locale}${path}`,
    languages,
  }
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  locale?: string
  path?: string
}): Promise<Metadata> => {
  const { doc, locale, path } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title ? doc?.meta?.title + ' | MARJA' : 'MARJA'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
    ...(locale != null && path != null ? { alternates: buildAlternates(locale, path) } : {}),
  }
}
