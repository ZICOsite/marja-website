'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

type PostCard = {
  id: string | number
  slug?: string | null
  title: string
  publishedAt?: string | null
  categories?: Array<{ id?: string | number; title?: string | null } | number | string> | null
  meta?: {
    description?: string | null
    image?: { url?: string | null; alt?: string | null } | number | string | null
  } | null
}

type Props = {
  posts: PostCard[]
  locale: string
}

export function PostsCarousel({ posts, locale }: Props) {
  const t = useTranslations()

  return (
    <Carousel opts={{ align: 'start', loop: false }} className="w-full">
      <CarouselContent className="-ml-4">
        {posts.map((post) => {
          const img =
            post.meta?.image && typeof post.meta.image === 'object'
              ? (post.meta.image as { url?: string | null; alt?: string | null })
              : null

          const categoryTitles = (post.categories ?? [])
            .filter((c): c is { title?: string | null } => typeof c === 'object' && c !== null)
            .map((c) => c.title)
            .filter(Boolean)
            .join(', ')

          const date = post.publishedAt
            ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(
                new Date(post.publishedAt),
              )
            : null

          return (
            <CarouselItem
              key={post.id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <Link
                href={`/${locale}/posts/${post.slug ?? ''}`}
                className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border hover:border-[var(--primary)] transition-colors bg-background"
              >
                {/* Изображение */}
                <div className="relative h-48 overflow-hidden bg-sidebar-accent shrink-0">
                  {img?.url ? (
                    <Image
                      src={img.url}
                      alt={img.alt ?? post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                      <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Контент */}
                <div className="p-5 flex flex-col flex-1">
                  {categoryTitles && (
                    <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest mb-2">
                      {categoryTitles}
                    </span>
                  )}
                  <h3 className="font-sans font-bold text-base leading-snug line-clamp-2 mb-2 group-hover:text-[var(--primary)] transition-colors">
                    {post.title}
                  </h3>
                  {post.meta?.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                      {post.meta.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    {date && <time className="text-xs text-muted-foreground">{date}</time>}
                    <span className="flex items-center gap-1 text-sm font-semibold text-[var(--primary)] ml-auto">
                      {t('common.readMore')}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          )
        })}
      </CarouselContent>

      <CarouselPrevious className="-left-5 hidden sm:flex" />
      <CarouselNext className="-right-5 hidden sm:flex" />
    </Carousel>
  )
}
