import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { Clock, FileText, Building2 } from 'lucide-react'
import Link from 'next/link'
import type { Locale } from '@/i18n/routing'

type ActivityItem = {
  id: string | number
  type: 'post' | 'project'
  title: string
  date: string | null
  href: string
}

type Props = {
  locale?: string
}

export async function RecentActivityBar({ locale = 'uz' }: Props) {
  const t = await getTranslations({ locale, namespace: 'activityFeed' })
  const payload = await getPayload({ config: configPromise })

  const twoMonthsAgo = new Date()
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
  const since = twoMonthsAgo.toISOString()

  const [postsResult, projectsResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 0,
      limit: 3,
      overrideAccess: false,
      locale: locale as Locale,
      sort: '-publishedAt',
      select: { title: true, slug: true, publishedAt: true },
      where: { publishedAt: { greater_than: since } },
    }),
    payload.find({
      collection: 'projects',
      depth: 0,
      limit: 3,
      overrideAccess: false,
      locale: locale as Locale,
      sort: '-createdAt',
      select: { title: true },
      where: { createdAt: { greater_than: since } },
    }),
  ])

  const posts: ActivityItem[] = postsResult.docs.map((doc) => ({
    id: doc.id,
    type: 'post',
    title: doc.title,
    date: doc.publishedAt ?? null,
    href: `/${locale}/posts/${doc.slug}`,
  }))

  const projects: ActivityItem[] = projectsResult.docs.map((doc) => ({
    id: doc.id,
    type: 'project',
    title: doc.title,
    date: (doc as any).createdAt ?? null,
    href: `/${locale}/projects`,
  }))

  const items = [...posts, ...projects]
    .sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 3)

  if (!items.length) return null

  return (
    <div className="border-b border-border bg-muted/40 mb-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 h-11">
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] shrink-0 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            {t('fresh')}
          </span>

          <div className="hidden sm:block w-px h-4 bg-border shrink-0" />

          <div className="flex items-center gap-1 overflow-x-auto min-w-0 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item, index) => (
              <div key={`${item.type}-${item.id}`} className="flex items-center gap-1 shrink-0 snap-start">
                {index > 0 && (
                  <span className="text-border mx-1 shrink-0">•</span>
                )}
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[var(--primary)] transition-colors whitespace-nowrap group"
                >
                  {item.type === 'post' ? (
                    <FileText className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  )}
                  <span className="truncate max-w-[160px] sm:max-w-[240px]">
                    {item.title}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
