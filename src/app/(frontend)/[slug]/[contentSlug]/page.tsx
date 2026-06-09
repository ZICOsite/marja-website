import type { Metadata } from 'next'
import type { Locale } from '@/i18n/routing'

export const dynamic = 'force-dynamic'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { RecentActivityBar } from '@/components/RecentActivityBar'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { routing } from '@/i18n/routing'

// slug = locale (uz/ru/en/tg/kk), contentSlug = page slug
type Args = {
  params: Promise<{
    slug: string
    contentSlug?: string
  }>
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      locale: 'all',
      select: { slug: true },
    })

    return routing.locales.flatMap((locale) =>
      pages.docs
        .filter((doc) => doc.slug !== 'home')
        .map(({ slug }) => ({ slug: locale, contentSlug: slug })),
    )
  } catch {
    return []
  }
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug: locale, contentSlug = 'home' } = await paramsPromise

  setRequestLocale(locale)

  const decodedContentSlug = decodeURIComponent(contentSlug)
  const url = contentSlug === 'home' ? `/${locale}` : `/${locale}/${decodedContentSlug}`

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({ slug: decodedContentSlug, locale })

  // Remove this code once your website is seeded
  if (!page && contentSlug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <RenderHero {...hero} locale={locale} />
      {contentSlug === 'home' && <RecentActivityBar locale={locale} />}
      <RenderBlocks blocks={layout} locale={locale} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: locale, contentSlug = 'home' } = await paramsPromise
  const decodedContentSlug = decodeURIComponent(contentSlug)
  const page = await queryPageBySlug({ slug: decodedContentSlug, locale })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug, locale }: { slug: string; locale: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    locale: locale as Locale,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
