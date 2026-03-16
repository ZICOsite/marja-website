import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'

// slug = locale
type Args = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q: string }>
}

export default async function Page({ params, searchParams: searchParamsPromise }: Args) {
  const { slug: locale } = await params
  const { q: query } = await searchParamsPromise

  setRequestLocale(locale)

  const t = await getTranslations('search')

  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    locale: locale as any,
    select: { title: true, slug: true, categories: true, meta: true },
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              { title: { like: query } },
              { 'meta.description': { like: query } },
              { 'meta.title': { like: query } },
              { slug: { like: query } },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">{t('title')}</h1>
          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>
      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container">{t('noResults')}</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return { title: 'Search' }
}
