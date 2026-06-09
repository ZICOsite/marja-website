import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { FileText, Building2, ArrowRight } from 'lucide-react'
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
  tagline?: string | null
  title: string
  description?: string | null
  locale?: string
}

export async function ActivityFeedBlockComponent({ tagline, title, description, locale = 'uz' }: Props) {
  const t = await getTranslations({ locale, namespace: 'activityFeed' })
  const payload = await getPayload({ config: configPromise })

  const twoMonthsAgo = new Date()
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
  const since = twoMonthsAgo.toISOString()

  const [postsResult, projectsResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 0,
      limit: 5,
      overrideAccess: false,
      locale: locale as Locale,
      sort: '-publishedAt',
      select: { title: true, slug: true, publishedAt: true },
      where: { publishedAt: { greater_than: since } },
    }),
    payload.find({
      collection: 'projects',
      depth: 0,
      limit: 5,
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
    .slice(0, 8)

  if (!items.length) return null

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          {tagline && (
            <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-sm block mb-2">
              {tagline}
            </span>
          )}
          <h2 className="text-4xl md:text-5xl font-bold font-heading">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-3 max-w-lg text-lg">{description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => {
            const date = item.date
              ? new Intl.DateTimeFormat(locale, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(item.date))
              : null

            const isPost = item.type === 'post'

            return (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.href}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-border hover:border-[var(--primary)] bg-background hover:bg-muted/50 transition-all"
              >
                <div
                  className={`mt-0.5 p-2 rounded-xl shrink-0 ${
                    isPost
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                      : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                  }`}
                >
                  {isPost ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isPost
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {t(item.type)}
                    </span>
                    {date && (
                      <time className="text-xs text-muted-foreground">{date}</time>
                    )}
                  </div>
                  <p className="font-semibold leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                    {item.title}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
