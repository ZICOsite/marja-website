'use client'

import Image from 'next/image'
import { Link } from '@/navigation'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/utilities/ui'

type GalleryImage = {
  url?: string | null
  alt?: string | null
}

type ProjectItem = {
  id: string | number
  title: string
  description?: string | null
  gallery?: (GalleryImage | number)[] | null
}

type Props = {
  tagline?: string | null
  title: string
  description?: string | null
  projects?: (ProjectItem | string)[] | null
  viewAllLabel?: string | null
  viewAllLink?: string | null
}

const SPAN_CLASSES: Record<number, Record<number, string>> = {
  3: {
    0: 'lg:col-span-2 lg:row-span-2',
    1: 'lg:col-start-3 lg:row-start-1',
    2: 'lg:col-start-3 lg:row-start-2',
  },
  4: {
    0: 'lg:col-start-1 lg:row-span-2',
    1: 'lg:col-start-2 lg:row-start-1',
    2: 'lg:col-start-2 lg:row-start-2',
    3: 'lg:col-start-3 lg:row-span-2',
  },
}

const GRID_CLASSES: Record<number, string> = {
  1: 'grid-cols-1 lg:grid-rows-[480px]',
  2: 'grid-cols-1 sm:grid-cols-2 lg:grid-rows-[400px]',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[280px_280px]',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[320px_320px]',
}

function isLargeCard(count: number, index: number): boolean {
  if (count === 4) return index === 0 || index === 3
  if (count === 3) return index === 0
  return false
}

export const CompletedProjectsBlock = ({
  tagline,
  title,
  description,
  projects,
  viewAllLabel,
  viewAllLink,
}: Props) => {
  const t = useTranslations('projects')

  const populated = (projects ?? []).filter(
    (p): p is ProjectItem => typeof p === 'object' && p !== null,
  )

  if (populated.length === 0) return null

  const count = Math.min(populated.length, 4) as 1 | 2 | 3 | 4

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
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
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="font-sans inline-flex items-center gap-2 font-semibold text-[var(--primary)] hover:underline shrink-0 group"
            >
              {viewAllLabel || t('viewAll')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <div className={cn('grid gap-4', GRID_CLASSES[count])}>
          {populated.map((project, index) => {
            const firstImg = (project.gallery ?? []).find(
              (g): g is GalleryImage => typeof g === 'object' && g !== null && !!g.url,
            )
            const large = isLargeCard(count, index)

            return (
              <div
                key={project.id}
                className={cn(
                  'group relative overflow-hidden rounded-2xl bg-muted',
                  SPAN_CLASSES[count]?.[index] ?? '',
                  large ? 'h-80 lg:h-full' : 'h-64 lg:h-full',
                )}
              >
                {firstImg?.url ? (
                  <Image
                    src={firstImg.url}
                    alt={firstImg.alt ?? project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                    <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 z-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className={cn(
                    'font-sans font-bold text-white leading-snug',
                    large ? 'text-xl' : 'text-base',
                  )}>
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-white/80 mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
