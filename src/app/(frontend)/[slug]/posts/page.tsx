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
import { buildAlternates } from '@/utilities/generateMeta'
import { BrandGraphic } from '@/components/BrandGraphic'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Args) {
  const { slug: locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'posts' })

  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    locale: locale as Locale,
    select: { title: true, slug: true, categories: true, meta: true, heroImage: true },
  })

  return (
    <div className="relative isolate overflow-hidden pt-24 pb-24">
      {/* Брендбук п. 5: паттерн окон по краям, как на «Контактах»; -z-10 — под карточками */}
      <BrandGraphic
        variant="windows"
        className="inset-0 -z-10 text-marja-navy/8 [--windows-fade:linear-gradient(to_right,#000,transparent_15%,transparent_85%,#000)]"
      />
      <PageClient />
      <div className="container mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">{t('title')}</h1>
        <div className="mt-4 text-muted-foreground">
          <PageRange
            currentPage={posts.page}
            limit={12}
            totalDocs={posts.totalDocs}
          />
        </div>
      </div>
      <CollectionArchive posts={posts.docs} />
      <div className="container mt-12">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug: locale } = await params
  const t = await getTranslations({ locale, namespace: 'posts' })
  return {
    title: t('title'),
    alternates: buildAlternates(locale, '/posts'),
  }
}
