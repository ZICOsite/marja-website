import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { cache } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { CategorySidebar, type CatNode } from './[...path]/CategorySidebar'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { ProductsNoticeCard } from '@/ProductsNotice/Component'
import type { ProductsNotice } from '@/payload-types'

type Args = {
  params: Promise<{ slug: string }>
}

type PayloadLocale = Parameters<Awaited<ReturnType<typeof getPayload>>['find']>[0]['locale']

export default async function ProductsCatalogPage({ params: paramsPromise }: Args) {
  const { slug: locale } = await paramsPromise
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'products' })

  const [topCategories, allCategories, notice] = await Promise.all([
    queryTopLevelCategories({ locale }),
    queryAllCategories({ locale }),
    getCachedGlobal('products-notice', 0, locale)() as Promise<ProductsNotice>,
  ])

  const tree = buildCategoryTree(allCategories)

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
            {notice?.enabled && notice.text && notice.position === 'above' && (
              <ProductsNoticeCard text={notice.text} />
            )}
            <CategorySidebar tree={tree} locale={locale} currentPath={[]} />
            {notice?.enabled && notice.text && notice.position === 'below' && (
              <ProductsNoticeCard text={notice.text} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold font-heading">{t('catalog')}</h1>
              <p className="text-muted-foreground mt-2 text-lg">{t('catalogDescription')}</p>
            </div>

            {topCategories.length === 0 ? (
              <p className="text-muted-foreground">{t('noCategories')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {topCategories.map((cat) => {
                  const imgUrl =
                    typeof cat.image === 'object' && cat.image?.url ? cat.image.url : null
                  const imgAlt =
                    typeof cat.image === 'object' && cat.image !== null && (cat.image as { alt?: string }).alt
                      ? (cat.image as { alt?: string }).alt
                      : cat.title

                  return (
                    <Link
                      key={cat.id}
                      href={`/${locale}/products/${cat.slug}`}
                      className="group rounded-2xl overflow-hidden border border-border hover:border-primary transition-colors bg-background flex flex-col"
                    >
                      <div className="relative h-52 overflow-hidden bg-sidebar-accent shrink-0">
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={imgAlt || cat.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full bg-gradient-to-br from-primary/10 to-primary/5" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h2 className="text-lg font-bold font-heading group-hover:text-primary transition-colors">
                          {cat.title}
                        </h2>
                        {cat.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
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
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: locale } = await paramsPromise
  const t = await getTranslations({ locale, namespace: 'products' })
  return { title: t('catalog') }
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

const queryTopLevelCategories = cache(async ({ locale }: { locale: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'product-categories',
    draft,
    limit: 100,
    pagination: false,
    overrideAccess: draft,
    locale: locale as PayloadLocale,
    sort: 'sortOrder',
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

const queryAllCategories = cache(async ({ locale }: { locale: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'product-categories',
    draft,
    limit: 200,
    pagination: false,
    overrideAccess: draft,
    locale: locale as PayloadLocale,
    sort: 'sortOrder',
    where: draft ? {} : { _status: { equals: 'published' } },
    depth: 0,
    select: { title: true, slug: true, parent: true, breadcrumbs: true },
  })

  return result.docs
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type FlatCat = {
  id: string | number
  title: string
  slug?: string | null
  parent?: string | number | { id: string | number } | null
  breadcrumbs?: Array<{ url?: string | null }> | null
}

function buildCategoryTree(cats: FlatCat[]): CatNode[] {
  const byId = new Map<string, CatNode>()

  for (const cat of cats) {
    const lastCrumb =
      Array.isArray(cat.breadcrumbs) && cat.breadcrumbs.length > 0
        ? cat.breadcrumbs[cat.breadcrumbs.length - 1]
        : null
    byId.set(String(cat.id), {
      id: String(cat.id),
      title: cat.title,
      slug: cat.slug ?? '',
      breadcrumbUrl: lastCrumb?.url ?? `/${cat.slug}`,
      children: [],
    })
  }

  const roots: CatNode[] = []

  for (const cat of cats) {
    const node = byId.get(String(cat.id))!
    const parentId =
      typeof cat.parent === 'object' && cat.parent !== null
        ? String(cat.parent.id)
        : typeof cat.parent === 'string' || typeof cat.parent === 'number'
          ? String(cat.parent)
          : null

    if (!parentId || !byId.has(parentId)) {
      roots.push(node)
    } else {
      byId.get(parentId)!.children.push(node)
    }
  }

  return roots
}
