import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { locales } from '@/i18n/routing'

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
      // Kanonik URL — kategoriyasiz (B variant): /{locale}/products/{slug}.
      // Sahifadagi canonical/hreflang va 308 redirect ham aynan shu sxemaga
      // ishlaydi, shuning uchun sitemap faqat kanonik URL'larni beradi.
      return locales.map((locale) => ({
        loc: `${SITE_URL}/${locale}/products/${product.slug}`,
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
