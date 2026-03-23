import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { cache } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function ProductsCatalogPage({ params: paramsPromise }: Args) {
  const { slug: locale } = await paramsPromise
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'products' })
  const categories = await queryTopLevelCategories({ locale })

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">{t('catalog')}</h1>
        <p className="text-muted-foreground mb-12 text-lg">{t('catalogDescription')}</p>

        {categories.length === 0 ? (
          <p className="text-muted-foreground">{t('noCategories')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => {
              const imgUrl =
                typeof cat.image === 'object' && cat.image?.url ? cat.image.url : null
              const imgAlt =
                typeof cat.image === 'object' && cat.image?.alt ? cat.image.alt : cat.title

              return (
                <Link
                  key={cat.id}
                  href={`/${locale}/products/${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-sidebar-accent border border-sidebar-accent hover:border-primary transition-colors"
                >
                  {imgUrl ? (
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={imgUrl}
                        alt={imgAlt || cat.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-52 bg-gradient-to-br from-primary/10 to-primary/5" />
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-bold font-heading mb-2 group-hover:text-primary transition-colors">
                      {cat.title}
                    </h2>
                    {cat.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: locale } = await paramsPromise
  const t = await getTranslations({ locale, namespace: 'products' })
  return {
    title: t('catalog'),
  }
}

const queryTopLevelCategories = cache(async ({ locale }: { locale: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'product-categories',
    draft,
    limit: 100,
    pagination: false,
    overrideAccess: draft,
    locale: locale as Parameters<typeof payload.find>[0]['locale'],
    where: {
      and: [
        { parent: { exists: false } },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    depth: 1,
  })

  return result.docs
})
