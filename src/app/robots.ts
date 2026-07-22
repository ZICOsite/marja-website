import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getServerSideURL()

  return {
    rules: [
      {
        userAgent: '*',
        // `/api/` va `/_next/` umuman yopiq bo'lsa, Google mahsulot rasmlari (/api/media/file/...)
        // va sahifa CSS/JS (/_next/static/) ni ocha olmaydi — Merchant Center mahsulotlarni
        // rad etadi. Shuning uchun aynan shu yo'llar ochib qo'yilgan (uzunroq mos yo'l ustun).
        allow: ['/', '/api/media/', '/_next/static/', '/_next/image'],
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/next/',
          '/_next/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
