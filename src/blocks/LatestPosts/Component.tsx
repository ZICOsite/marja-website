import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { PostsCarousel } from './PostsCarousel'

type Props = {
  tagline?: string | null
  title: string
  description?: string | null
  viewAllLabel?: string | null
  viewAllLink?: string | null
}

export async function LatestPostsBlock({
  tagline,
  title,
  description,
  viewAllLabel,
  viewAllLink,
}: Props) {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'posts' })

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 8,
    overrideAccess: false,
    locale: locale as Parameters<typeof payload.find>[0]['locale'],
    sort: '-publishedAt',
    select: { title: true, slug: true, categories: true, meta: true, publishedAt: true, heroImage: true },
  })

  if (!result.docs.length) return null

  const posts = result.docs.map((doc) => {
    const heroImg =
      doc.heroImage && typeof doc.heroImage === 'object'
        ? { url: (doc.heroImage as any).url ?? null, alt: (doc.heroImage as any).alt ?? null }
        : null
    const metaImg =
      doc.meta?.image && typeof doc.meta.image === 'object'
        ? { url: (doc.meta.image as any).url ?? null, alt: (doc.meta.image as any).alt ?? null }
        : null

    return {
      id: doc.id,
      slug: doc.slug,
      title: doc.title,
      publishedAt: doc.publishedAt ?? null,
      categories: (doc.categories ?? []).map((c) =>
        typeof c === 'object' && c !== null ? { id: c.id, title: (c as any).title ?? null } : c,
      ),
      meta: {
        description: doc.meta?.description ?? null,
        image: heroImg ?? metaImg,
      },
    }
  })

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Шапка */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            {tagline && (
              <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-sm block mb-2">
                {tagline}
              </span>
            )}
            <h2 className="text-4xl md:text-5xl font-bold font-heading">{title}</h2>
            {description && (
              <p className="text-muted-foreground mt-3 max-w-lg text-lg">{description}</p>
            )}
          </div>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="font-sans inline-flex items-center gap-2 font-semibold text-[var(--primary)] hover:underline shrink-0 group"
            >
              {viewAllLabel || t('title')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <PostsCarousel posts={posts} locale={locale} />
      </div>
    </section>
  )
}
