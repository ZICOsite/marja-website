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
import { ProductCard } from '@/components/ProductCard'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductTabs } from '@/components/ProductTabs'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import { OrderDialog } from '@/components/Product/OrderDialog'
import { AddToCartButton } from '@/components/Cart/AddToCartButton'
import { CategorySidebar, type CatNode } from './CategorySidebar'
import { SortBar } from './SortBar'
import { RelatedProductsSlider } from './RelatedProductsSlider'
import { AttributeFilters, type FilterAttr } from './AttributeFilters'
import { getServerSideURL } from '@/utilities/getURL'
import { buildAlternates } from '@/utilities/generateMeta'
import { formatPrice } from '@/utilities/formatPrice'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { ProductsNoticeCard } from '@/ProductsNotice/Component'
import type { ProductsNotice } from '@/payload-types'

export const dynamic = 'force-dynamic'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Args = {
  params: Promise<{ slug: string; path: string[] }>
  searchParams: Promise<{ sort?: string; f?: string | string[] }>
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
  const { sort = '', f } = await searchParamsPromise
  setRequestLocale(locale)

  const lastSegment = path[path.length - 1]!

  const product = await queryProductBySlug({ slug: lastSegment, locale })
  if (product) {
    return <ProductDetailPage product={product} locale={locale} path={path} />
  }

  const category = await queryCategoryBySlug({ slug: lastSegment, locale })
  if (!category) return notFound()

  const activeFilters: string[] = Array.isArray(f) ? f : f ? [f] : []

  return (
    <CategoryPage
      category={category}
      locale={locale}
      path={path}
      sort={sort}
      activeFilters={activeFilters}
    />
  )
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
  const tOrder = await getTranslations({ locale, namespace: 'order' })

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

  // JSON-LD structured data for Google rich results
  const productUrl = `${getServerSideURL()}/${locale}/products/${path.join('/')}`
  const imageUrls = galleryImages.map((img) => img.url)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    ...(imageUrls.length > 0 && { image: imageUrls }),
    ...(product.shortDescription && { description: product.shortDescription }),
    ...(product.sku && { sku: product.sku }),
    url: productUrl,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      ...(!product.priceOnRequest &&
        product.price != null && {
        price: String(product.price),
        priceCurrency: product.currency ?? 'UZS',
      }),
    },
  }

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} className="mb-8" />

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
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-6 ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
              >
                {product.inStock ? t('inStock') : t('outOfStock')}
              </span>

              {(product.priceOnRequest || product.price != null) && (
                <div className="mb-6">
                  <p className="text-3xl font-bold text-primary">
                    {product.priceOnRequest
                      ? t('priceOnRequest')
                      : `${formatPrice(product.price as number)} ${product.currency ?? 'UZS'}`}
                  </p>
                </div>
              )}

              {product.shortDescription && (
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {product.shortDescription}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <OrderDialog
                  items={[{ title: product.title, url: productUrl, sku: product.sku }]}
                  trigger={
                    <Button size="lg" className="gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      {tOrder('buttonLabel')}
                    </Button>
                  }
                />
                <AddToCartButton
                  product={{
                    id: String(product.id),
                    title: product.title,
                    href: `/${locale}/products/${path.join('/')}`,
                    image: heroImage?.url ?? null,
                    price: product.priceOnRequest ? null : ((product.price as number | null) ?? null),
                    currency: product.currency ?? null,
                    priceOnRequest: product.priceOnRequest ?? null,
                    sku: product.sku ?? null,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Табы: Описание / Характеристики / Документация */}
          <div className="mb-16">
            <ProductTabs
              hasDescription={!!product.description}
              description={
                product.description ? (
                  <RichText data={product.description} enableGutter={false} locale={locale} />
                ) : undefined
              }
              specGroups={groupedSpecs}
              productTitle={product.title}
              standardLabel={product.standardLabel}
              qualityNote={product.qualityNote}
              warrantyNote={product.warrantyNote}
              documents={(product.documents ?? []).map((doc) => ({
                category: doc.category,
                files: (doc.files ?? []).map((f) => {
                  const file = typeof f.file === 'object' ? f.file : null
                  return {
                    label: f.label,
                    fileUrl: file?.url ?? null,
                    filename: file?.filename ?? null,
                  }
                }),
              }))}
              labels={{
                description: t('description'),
                specifications: t('specifications'),
                documents: t('documents'),
                noDocuments: t('noDocuments'),
                downloadDocument: t('downloadDocument'),
                specIndicator: t('specIndicator'),
                specIndicatorValue: t('specIndicatorValue'),
                specActualValues: t('specActualValues'),
              }}
            />
          </div>

          {/* Похожие товары */}
          {Array.isArray(product.relatedProducts) && product.relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold font-heading mb-6">{t('relatedProducts')}</h2>
              <RelatedProductsSlider
                products={product.relatedProducts.filter(
                  (r): r is Extract<typeof r, object> => typeof r === 'object',
                )}
                locale={locale}
              />
            </div>
          )}
        </div>
      </div>
    </>
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
  activeFilters,
}: {
  category: Awaited<ReturnType<typeof queryCategoryBySlug>>
  locale: string
  path: string[]
  sort: string
  activeFilters: string[]
}) {
  if (!category) return notFound()
  const t = await getTranslations({ locale, namespace: 'products' })

  const [subcategories, products, allCategories, filterAttrs, notice] = await Promise.all([
    querySubcategories({ parentId: String(category.id), locale }),
    queryProductsByCategory({ categoryId: String(category.id), locale, sort }),
    queryAllCategories({ locale }),
    queryFilterableAttrs({ categoryId: String(category.id), locale }),
    getCachedGlobal('products-notice', 0, locale)() as Promise<ProductsNotice>,
  ])

  // Apply attribute filters client-side (AND between attrs, OR within same attr)
  const filteredProducts =
    activeFilters.length === 0
      ? products
      : products.filter((p) => {
        const productTokens = new Set(
          ((p as { filterValues?: Array<{ value?: string | null }> }).filterValues ?? []).map(
            (fv) => fv.value ?? '',
          ),
        )
        const bySlug = new Map<string, string[]>()
        for (const token of activeFilters) {
          const colonIdx = token.indexOf(':')
          if (colonIdx === -1) continue
          const slug = token.slice(0, colonIdx)
          if (!bySlug.has(slug)) bySlug.set(slug, [])
          bySlug.get(slug)!.push(token)
        }
        return Array.from(bySlug.values()).every((tokens) =>
          tokens.some((t) => productTokens.has(t)),
        )
      })

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
    typeof category.image === 'object' && category.image !== null
      ? ((category.image as { alt?: string }).alt ?? category.title)
      : category.title

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={crumbs} className="mb-6" />

        {/* Баннер категории */}
        {imgUrl && (
          <div className="relative rounded-2xl overflow-hidden h-44 mb-8">
            <Image src={'/banner.png'} alt={imgAlt} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-8">
              <h1 className="text-2xl font-bold font-heading text-white">{category.title}</h1>
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

        {/* Подкатегории как pills — только когда есть прямые товары */}
        {subcategories.length > 0 && filteredProducts.length > 0 && (
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
          <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
            {notice?.enabled && notice.text && notice.position === 'above' && (
              <ProductsNoticeCard text={notice.text} />
            )}
            <CategorySidebar tree={tree} locale={locale} currentPath={path} />
            {filteredProducts.length > 0 && (
              <AttributeFilters
                attrs={filterAttrs}
                selected={activeFilters}
                currentSort={sort}
              />
            )}
            {notice?.enabled && notice.text && notice.position === 'below' && (
              <ProductsNoticeCard text={notice.text} />
            )}
          </div>

          {/* Правая часть */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length > 0 ? (
              <>
                <SortBar current={sort} total={filteredProducts.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      href={`/${locale}/products/${path.join('/')}/${product.slug}`}
                      title={product.title}
                      sku={product.sku}
                      inStock={product.inStock}
                      heroImage={product.heroImage}
                      shortDescription={product.shortDescription}
                      price={product.price as number | null}
                      priceOnRequest={product.priceOnRequest}
                      currency={product.currency}
                      locale={locale}
                    />
                  ))}
                </div>
              </>
            ) : subcategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {subcategories.map((sub) => {
                  const imgUrl =
                    typeof sub.image === 'object' && sub.image?.url ? sub.image.url : null
                  const imgAlt =
                    typeof sub.image === 'object' && sub.image !== null
                      ? ((sub.image as { alt?: string }).alt ?? sub.title)
                      : sub.title
                  return (
                    <Link
                      key={sub.id}
                      href={`/${locale}/products/${path.join('/')}/${sub.slug}`}
                      className="group rounded-2xl overflow-hidden border border-border hover:border-primary transition-colors bg-background flex flex-col"
                    >
                      <div className="relative h-52 overflow-hidden bg-sidebar-accent shrink-0">
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={imgAlt || sub.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full bg-gradient-to-br from-primary/10 to-primary/5" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h2 className="text-lg font-bold font-heading group-hover:text-primary transition-colors">
                          {sub.title}
                        </h2>
                        {sub.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {sub.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-muted-foreground">{t('noProducts')}</div>
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

// Kategoriya sahifasida meta description bo'sh bo'lsa — SEO uchun aqlli fallback.
function categoryMetaDescription(locale: string, name: string): string {
  const t: Record<string, string> = {
    uz: `${name} — marja.uz'da keng assortimentda. Sifatli gidroizolyatsiya materiallari, kafolat va professional maslahat. Toshkent bo'ylab yetkazib berish.`,
    ru: `${name} — широкий ассортимент на marja.uz. Качественные гидроизоляционные материалы, гарантия и профессиональная консультация. Доставка по Ташкенту.`,
    en: `${name} — wide range at marja.uz. Quality waterproofing materials, warranty and professional advice. Delivery across Tashkent.`,
  }
  return t[locale] || t.ru!
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: locale, path } = await paramsPromise
  const lastSegment = path[path.length - 1]!
  const pagePath = `/products/${path.join('/')}`

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
      alternates: buildAlternates(locale, pagePath),
    }
  }

  const category = await queryCategoryBySlug({ slug: lastSegment, locale })
  const categoryName = category?.meta?.title || category?.title
  return {
    title: categoryName ? `${categoryName} | MARJA` : undefined,
    description:
      category?.meta?.description ||
      category?.description ||
      (categoryName ? categoryMetaDescription(locale, categoryName) : undefined),
    alternates: buildAlternates(locale, pagePath),
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
      sort: 'sortOrder',
      where: {
        and: [
          { parent: { equals: parentId } },
          ...(draft ? [] : [{ _status: { equals: 'published' } }]),
        ],
      },
      depth: 1,
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
              : 'order'

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

const queryFilterableAttrs = cache(
  async ({ categoryId, locale }: { categoryId: string; locale: string }): Promise<FilterAttr[]> => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    // Fetch all products in category — only filterValues field
    const { docs: products } = await payload.find({
      collection: 'products',
      draft,
      limit: 200,
      pagination: false,
      overrideAccess: draft,
      locale: locale as PayloadLocale,
      where: {
        and: [
          { categories: { in: [categoryId] } },
          ...(draft ? [] : [{ _status: { equals: 'published' } }]),
        ],
      },
      select: { filterValues: true },
      depth: 0,
    })

    // Collect unique values per attribute slug
    const valuesBySlug = new Map<string, Set<string>>()
    for (const product of products) {
      const fvs = (product as { filterValues?: Array<{ value?: string | null }> }).filterValues ?? []
      for (const fv of fvs) {
        if (!fv.value) continue
        const colonIdx = fv.value.indexOf(':')
        if (colonIdx === -1) continue
        const slug = fv.value.slice(0, colonIdx)
        const val = fv.value.slice(colonIdx + 1)
        if (!valuesBySlug.has(slug)) valuesBySlug.set(slug, new Set())
        valuesBySlug.get(slug)!.add(val)
      }
    }

    if (valuesBySlug.size === 0) return []

    // Fetch attribute metadata for found slugs
    const { docs: attrs } = await payload.find({
      collection: 'attributes',
      limit: 50,
      pagination: false,
      overrideAccess: true,
      locale: locale as PayloadLocale,
      where: {
        and: [
          { filterable: { equals: true } },
          { slug: { in: Array.from(valuesBySlug.keys()) } },
        ],
      },
      depth: 0,
    })

    return attrs
      .map((attr) => ({
        slug: attr.slug,
        name: typeof attr.name === 'string' ? attr.name : '',
        unit: attr.unit ?? null,
        values: Array.from(valuesBySlug.get(attr.slug) ?? []).sort(),
      }))
      .filter((a) => a.values.length > 0)
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

type SpecItem = { attribute: unknown; value?: string | null; standardValue?: string | null }
type GroupedSpec = {
  groupName: string | null
  items: { attrName: string; value: string; unit: string | null; standardValue: string | null }[]
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
    const standardValue = spec.standardValue ?? null
    const groupName =
      typeof attr.group === 'object' && attr.group !== null ? (attr.group.name ?? null) : null
    const groupKey = groupName ?? '__none__'

    if (!groups.has(groupKey)) groups.set(groupKey, { groupName, items: [] })
    groups.get(groupKey)!.items.push({ attrName, value: spec.value ?? '', unit, standardValue })
  }

  return Array.from(groups.values())
}
