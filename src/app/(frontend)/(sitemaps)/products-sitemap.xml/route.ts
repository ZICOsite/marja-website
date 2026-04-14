import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { locales } from '@/i18n/routing'
import type { ProductCategory } from '@/payload-types'

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

const getProductsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    const results = await payload.find({
      collection: 'products',
      overrideAccess: false,
      draft: false,
      depth: 1,
      limit: 2000,
      pagination: false,
      locale: 'all',
      where: { _status: { equals: 'published' } },
      select: { slug: true, updatedAt: true, categories: true },
    })

    const dateFallback = new Date().toISOString()

    return results.docs.flatMap((product) => {
      // Берём первую категорию для построения URL
      const firstCat =
        Array.isArray(product.categories) && product.categories.length > 0
          ? (product.categories[0] as ProductCategory)
          : null

      const categoryPath = (() => {
        if (!firstCat || typeof firstCat !== 'object') return ''
        const crumbs = firstCat.breadcrumbs as Array<{ url?: string }> | null | undefined
        if (Array.isArray(crumbs) && crumbs.length > 0) {
          return crumbs[crumbs.length - 1]?.url ?? `/${firstCat.slug}`
        }
        return `/${firstCat.slug}`
      })()

      return locales.map((locale) => ({
        loc: `${SITE_URL}/${locale}/products${categoryPath}/${product.slug}`,
        lastmod: product.updatedAt || dateFallback,
      }))
    })
  },
  ['products-sitemap'],
  { tags: ['products-sitemap'] },
)

export async function GET() {
  const sitemap = await getProductsSitemap()
  return getServerSideSitemap(sitemap)
}
