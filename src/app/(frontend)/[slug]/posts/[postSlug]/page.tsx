import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'
import React, { cache } from 'react'
import RichText from '@/components/RichText'


import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { routing } from '@/i18n/routing'

// slug = locale, postSlug = post slug
type Args = {
  params: Promise<{
    slug: string
    postSlug: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    locale: 'all',
    select: { slug: true },
  })

  return routing.locales.flatMap((locale) =>
    posts.docs.map(({ slug }) => ({ slug: locale, postSlug: slug })),
  )
}

export default async function PostPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug: locale, postSlug = '' } = await paramsPromise

  setRequestLocale(locale)

  const decodedPostSlug = decodeURIComponent(postSlug)
  const url = `/${locale}/posts/${decodedPostSlug}`
  const post = await queryPostBySlug({ slug: decodedPostSlug, locale })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <PostHero post={post} />
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText /* className="max-w-[48rem] mx-auto" */ data={post.content} enableGutter={false} locale={locale} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object' && post !== null)}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: locale, postSlug = '' } = await paramsPromise
  const decodedPostSlug = decodeURIComponent(postSlug)
  const post = await queryPostBySlug({ slug: decodedPostSlug, locale })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug, locale }: { slug: string; locale: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    locale: locale as any,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
