import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import RichText from '@/components/RichText'
import { ProductGallery } from '@/components/ProductGallery'
import { CategorySidebar, type CatNode } from './CategorySidebar'
import { SortBar } from './SortBar'
import { Download } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Args = {
  params: Promise<{ slug: string; path: string[] }>
  searchParams: Promise<{ sort?: string }>
}

type BreadcrumbItem = { label?: string | null; url?: string | null }

type PayloadLocale = Parameters<Awaited<ReturnType<typeof getPayload>>['find']>[0]['locale']

// ---------------------------------------------------------------------------
// Page — определяем: товар или категория
// ---------------------------------------------------------------------------

export default async function ProductsPathPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args) {
  const { slug: locale, path } = await paramsPromise
  const { sort = '' } = await searchParamsPromise
  setRequestLocale(locale)

  const lastSegment = path[path.length - 1]!

  const product = await queryProductBySlug({ slug: lastSegment, locale })
  if (product) {
    return <ProductDetailPage product={product} locale={locale} path={path} />
  }

  const category = await queryCategoryBySlug({ slug: lastSegment, locale })
  if (!category) return notFound()

  return <CategoryPage category={category} locale={locale} path={path} sort={sort} />
}

// ---------------------------------------------------------------------------
// Product detail page
// ---------------------------------------------------------------------------

async function ProductDetailPage({
  product,
  locale,
  path,
}: {
  product: Awaited<ReturnType<typeof queryProductBySlug>>
  locale: string
  path: string[]
}) {
  if (!product) return notFound()
  const t = await getTranslations({ locale, namespace: 'products' })

  const heroImage =
    typeof product.heroImage === 'object' && product.heroImage?.url
      ? { url: product.heroImage.url, alt: product.heroImage.alt ?? '' }
      : null

  const galleryImages: { url: string; alt?: string | null }[] = [
    ...(heroImage ? [heroImage] : []),
    ...(Array.isArray(product.gallery)
      ? product.gallery.flatMap((item) => {
          const img = typeof item.image === 'object' ? item.image : null
          return img?.url ? [{ url: img.url, alt: img.alt }] : []
        })
      : []),
  ]

  const groupedSpecs = groupSpecifications(product.specifications ?? [])

  const primaryCategory =
    Array.isArray(product.categories) && product.categories.length > 0
      ? (product.categories[0] as { breadcrumbs?: BreadcrumbItem[]; title?: string; slug?: string })
      : null

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('catalog'), url: `/${locale}/products` },
    ...(primaryCategory?.breadcrumbs?.map((b) => ({
      label: b.label,
      url: `/${locale}/products${b.url}`,
    })) ?? []),
    { label: product.title, url: null },
  ]

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap gap-1 items-center text-sm text-muted-foreground mb-8">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="select-none">/</span>}
              {crumb.url ? (
                <Link href={crumb.url} className="hover:text-primary transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Галерея */}
          <ProductGallery images={galleryImages} />

          {/* Информация */}
          <div>
            {product.sku && (
              <p className="text-sm text-muted-foreground mb-2">
                {t('sku')}: <span className="font-mono">{product.sku}</span>
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">{product.title}</h1>

            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-6 ${
                product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {product.inStock ? t('inStock') : t('outOfStock')}
            </span>

            {(product.priceOnRequest || product.price != null) && (
              <div className="mb-6">
                <p className="text-3xl font-bold text-primary">
                  {product.priceOnRequest
                    ? t('priceOnRequest')
                    : `${(product.price as number).toLocaleString()} ${product.currency ?? 'UZS'}`}
                </p>
              </div>
            )}

            {product.shortDescription && (
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {product.shortDescription}
              </p>
            )}

            {Array.isArray(product.documents) && product.documents.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-3">{t('documents')}</h3>
                <div className="flex flex-col gap-2">
                  {product.documents.map((doc, i) => {
                    const file = typeof doc.file === 'object' ? doc.file : null
                    return file?.url ? (
                      <a
                        key={i}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline text-sm"
                      >
                        <span>
                          <Download size={14} />
                        </span>
                        <span>{doc.label ?? file.filename ?? t('downloadDocument')}</span>
                      </a>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Описание */}
        {product.description && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold font-heading mb-6">{t('description')}</h2>
            <RichText data={product.description} enableGutter={false} />
          </div>
        )}

        {/* Характеристики */}
        {groupedSpecs.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold font-heading mb-6">{t('specifications')}</h2>
            <div className="space-y-8">
              {groupedSpecs.map((group, gi) => (
                <div key={gi}>
                  {group.groupName && (
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                      {group.groupName}
                    </h3>
                  )}
                  <div className="rounded-xl border border-border overflow-hidden">
                    {group.items.map((spec, si) => (
                      <div
                        key={si}
                        className={`flex items-center px-5 py-3 ${
                          si % 2 === 0 ? 'bg-background' : 'bg-sidebar-accent/40'
                        }`}
                      >
                        <span className="text-muted-foreground flex-1">{spec.attrName}</span>
                        <span className="font-medium">
                          {spec.value}
                          {spec.unit && (
                            <span className="text-muted-foreground ml-1">{spec.unit}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Похожие товары */}
        {Array.isArray(product.relatedProducts) && product.relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold font-heading mb-6">{t('relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((related) => {
                if (typeof related !== 'object') return null
                const img = typeof related.heroImage === 'object' ? related.heroImage : null
                return (
                  <Link
                    key={related.id}
                    href={`/${locale}/products/${related.slug}`}
                    className="group rounded-xl overflow-hidden border border-border hover:border-primary transition-colors"
                  >
                    {img?.url ? (
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={img.url}
                          alt={img.alt ?? ''}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-sidebar-accent" />
                    )}
                    <div className="p-4">
                      <h3 className="font-sans font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      {related.sku && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                          {related.sku}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Category page — sidebar + products
// ---------------------------------------------------------------------------

async function CategoryPage({
  category,
  locale,
  path,
  sort,
}: {
  category: Awaited<ReturnType<typeof queryCategoryBySlug>>
  locale: string
  path: string[]
  sort: string
}) {
  if (!category) return notFound()
  const t = await getTranslations({ locale, namespace: 'products' })

  const [subcategories, products, allCategories] = await Promise.all([
    querySubcategories({ parentId: String(category.id), locale }),
    queryProductsByCategory({ categoryId: String(category.id), locale, sort }),
    queryAllCategories({ locale }),
  ])

  const tree = buildCategoryTree(allCategories)

  const crumbs: BreadcrumbItem[] = [
    { label: t('catalog'), url: `/${locale}/products` },
    ...(Array.isArray(category.breadcrumbs)
      ? category.breadcrumbs.map((b: BreadcrumbItem) => ({
          label: b.label,
          url: `/${locale}/products${b.url}`,
        }))
      : [{ label: category.title, url: null }]),
  ]

  const imgUrl =
    typeof category.image === 'object' && category.image?.url ? category.image.url : null
  const imgAlt =
    typeof category.image === 'object'
      ? ((category.image as { alt?: string }).alt ?? category.title)
      : category.title

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap gap-1 items-center text-sm text-muted-foreground mb-6">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="select-none">/</span>}
              {crumb.url ? (
                <Link href={crumb.url} className="hover:text-primary transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Баннер категории */}
        {imgUrl && (
          <div className="relative rounded-2xl overflow-hidden h-44 mb-8">
            <Image src={imgUrl} alt={imgAlt} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-8">
              <h1 className="text-4xl font-bold font-heading text-white">{category.title}</h1>
              {category.description && (
                <p className="text-white/80 mt-1 text-sm max-w-md">{category.description}</p>
              )}
            </div>
          </div>
        )}
        {!imgUrl && (
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-heading">{category.title}</h1>
            {category.description && (
              <p className="text-muted-foreground text-lg mt-2">{category.description}</p>
            )}
          </div>
        )}

        {/* Подкатегории */}
        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/${locale}/products/${path.join('/')}/${sub.slug}`}
                className="px-4 py-2 rounded-xl border border-border hover:border-primary hover:text-primary text-sm font-medium transition-colors bg-background"
              >
                {sub.title}
              </Link>
            ))}
          </div>
        )}

        {/* Layout: sidebar слева, товары справа */}
        <div className="flex flex-col lg:flex-row gap-8">
          <CategorySidebar tree={tree} locale={locale} currentPath={path} />

          {/* Правая часть */}
          <div className="flex-1 min-w-0">
            <SortBar current={sort} total={products.length} />

            {products.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">{t('noProducts')}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => {
                  const img = typeof product.heroImage === 'object' ? product.heroImage : null
                  return (
                    <Link
                      key={product.id}
                      href={`/${locale}/products/${path.join('/')}/${product.slug}`}
                      className="group rounded-2xl overflow-hidden border border-border hover:border-primary transition-colors bg-background flex flex-col"
                    >
                      <div className="relative h-52 overflow-hidden bg-sidebar-accent shrink-0">
                        {img?.url ? (
                          <Image
                            src={img.url}
                            alt={img.alt ?? ''}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : null}
                        <span
                          className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
                            product.inStock
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.inStock ? t('inStock') : t('outOfStock')}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        {product.sku && (
                          <p className="text-xs text-muted-foreground font-mono mb-1">
                            {product.sku}
                          </p>
                        )}
                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 flex-1 font-sans">
                          {product.title}
                        </h3>
                        {product.shortDescription && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {product.shortDescription}
                          </p>
                        )}
                        {(product.priceOnRequest || product.price != null) && (
                          <p className="mt-3 text-base font-bold text-primary">
                            {product.priceOnRequest
                              ? t('priceOnRequest')
                              : `${(product.price as number).toLocaleString()} ${product.currency ?? 'UZS'}`}
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

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: locale, path } = await paramsPromise
  const lastSegment = path[path.length - 1]!

  const product = await queryProductBySlug({ slug: lastSegment, locale })
  if (product) {
    return {
      title: product.meta?.title || product.title,
      description: product.meta?.description || product.shortDescription || undefined,
      openGraph: {
        images:
          typeof product.meta?.image === 'object' && product.meta.image?.url
            ? [{ url: product.meta.image.url }]
            : typeof product.heroImage === 'object' && product.heroImage?.url
              ? [{ url: product.heroImage.url }]
              : [],
      },
    }
  }

  const category = await queryCategoryBySlug({ slug: lastSegment, locale })
  return {
    title: category?.meta?.title || category?.title || undefined,
    description: category?.meta?.description || category?.description || undefined,
  }
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

const queryProductBySlug = cache(async ({ slug, locale }: { slug: string; locale: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    locale: locale as PayloadLocale,
    where: {
      and: [{ slug: { equals: slug } }, ...(draft ? [] : [{ _status: { equals: 'published' } }])],
    },
    depth: 3,
  })

  return result.docs?.[0] ?? null
})

const queryCategoryBySlug = cache(async ({ slug, locale }: { slug: string; locale: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'product-categories',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    locale: locale as PayloadLocale,
    where: {
      and: [{ slug: { equals: slug } }, ...(draft ? [] : [{ _status: { equals: 'published' } }])],
    },
    depth: 1,
  })

  return result.docs?.[0] ?? null
})

const querySubcategories = cache(
  async ({ parentId, locale }: { parentId: string; locale: string }) => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'product-categories',
      draft,
      limit: 50,
      pagination: false,
      overrideAccess: draft,
      locale: locale as PayloadLocale,
      where: {
        and: [
          { parent: { equals: parentId } },
          ...(draft ? [] : [{ _status: { equals: 'published' } }]),
        ],
      },
      depth: 0,
    })

    return result.docs
  },
)

const queryProductsByCategory = cache(
  async ({ categoryId, locale, sort }: { categoryId: string; locale: string; sort: string }) => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const payloadSort =
      sort === 'new'
        ? '-publishedAt'
        : sort === 'title'
          ? 'title'
          : sort === 'price_asc'
            ? 'price'
            : sort === 'price_desc'
              ? '-price'
              : '-createdAt'

    const result = await payload.find({
      collection: 'products',
      draft,
      limit: 100,
      pagination: false,
      overrideAccess: draft,
      locale: locale as PayloadLocale,
      sort: payloadSort,
      where: {
        and: [
          { categories: { in: [categoryId] } },
          ...(draft ? [] : [{ _status: { equals: 'published' } }]),
        ],
      },
      depth: 1,
    })

    return result.docs
  },
)

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

type SpecItem = { attribute: unknown; value?: string | null }
type GroupedSpec = {
  groupName: string | null
  items: { attrName: string; value: string; unit: string | null }[]
}

function groupSpecifications(specifications: SpecItem[]): GroupedSpec[] {
  const groups = new Map<string, GroupedSpec>()

  for (const spec of specifications) {
    const attr = spec.attribute as {
      name?: string
      unit?: string | null
      group?: { name?: string } | string | null
    } | null

    if (!attr || typeof attr !== 'object') continue

    const attrName = attr.name ?? ''
    const unit = attr.unit ?? null
    const groupName =
      typeof attr.group === 'object' && attr.group !== null ? (attr.group.name ?? null) : null
    const groupKey = groupName ?? '__none__'

    if (!groups.has(groupKey)) groups.set(groupKey, { groupName, items: [] })
    groups.get(groupKey)!.items.push({ attrName, value: spec.value ?? '', unit })
  }

  return Array.from(groups.values())
}
