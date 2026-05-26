import type { Metadata } from 'next/types'
import type { Locale } from '@/i18n/routing'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

export const revalidate = 600

// slug = locale, pageNumber = page number
type Args = {
  params: Promise<{ slug: string; pageNumber: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug: locale, pageNumber } = await paramsPromise

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'posts' })

  const payload = await getPayload({ config: configPromise })
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
    locale: locale as Locale,
    select: { title: true, slug: true, categories: true, meta: true, heroImage: true },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{t('title')}</h1>
        </div>
      </div>
      <div className="container mb-8">
        <PageRange
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>
      <CollectionArchive posts={posts.docs} />
      <div className="container">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: locale, pageNumber } = await paramsPromise
  const t = await getTranslations({ locale, namespace: 'posts' })
  return {
    title: `${t('title')} — ${t('page', { number: pageNumber })}`,
    robots: { index: false, follow: true },
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const { totalDocs } = await payload.count({
      collection: 'posts',
      overrideAccess: false,
    })

    const totalPages = Math.ceil(totalDocs / 12)

    return routing.locales.flatMap((locale) => {
      const pages: { slug: string; pageNumber: string }[] = []
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ slug: locale, pageNumber: String(i) })
      }
      return pages
    })
  } catch {
    return []
  }
}
