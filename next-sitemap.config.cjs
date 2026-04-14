const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: false,
  exclude: [
    '/pages-sitemap.xml',
    '/posts-sitemap.xml',
    '/products-sitemap.xml',
    '/product-categories-sitemap.xml',
    '/*',
    '/posts/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/product-categories-sitemap.xml`,
      `${SITE_URL}/products-sitemap.xml`,
    ],
  },
}
