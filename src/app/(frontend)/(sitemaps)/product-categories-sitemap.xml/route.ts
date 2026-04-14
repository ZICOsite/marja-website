import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { locales } from '@/i18n/routing'

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

const getCategoriesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    const results = await payload.find({
      collection: 'product-categories',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      locale: 'all',
      where: { _status: { equals: 'published' } },
      select: { slug: true, updatedAt: true, breadcrumbs: true },
    })

    const dateFallback = new Date().toISOString()

    // Добавляем корень каталога
    const catalogRoot = locales.map((locale) => ({
      loc: `${SITE_URL}/${locale}/products`,
      lastmod: dateFallback,
    }))

    const categoryPages = results.docs.flatMap((cat) => {
      const crumbs = cat.breadcrumbs as Array<{ url?: string }> | null | undefined
      const breadcrumbUrl =
        Array.isArray(crumbs) && crumbs.length > 0
          ? (crumbs[crumbs.length - 1]?.url ?? `/${cat.slug}`)
          : `/${cat.slug}`

      return locales.map((locale) => ({
        loc: `${SITE_URL}/${locale}/products${breadcrumbUrl}`,
        lastmod: cat.updatedAt || dateFallback,
      }))
    })

    return [...catalogRoot, ...categoryPages]
  },
  ['product-categories-sitemap'],
  { tags: ['product-categories-sitemap'] },
)

export async function GET() {
  const sitemap = await getCategoriesSitemap()
  return getServerSideSitemap(sitemap)
}
