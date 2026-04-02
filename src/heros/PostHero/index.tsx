import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'
import { getTranslations } from 'next-intl/server'

import type { Media, Post } from '@/payload-types'

import { formatAuthors } from '@/utilities/formatAuthors'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { CopyLinkButton } from './CopyLinkButton'
import { PostGallery, type GalleryImage } from './PostGallery'
import { PostVideoEmbed } from './PostVideoEmbed'

export const PostHero: React.FC<{
  post: Post
}> = async ({ post }) => {
  const { categories, heroImage, gallery, videoUrl, populatedAuthors, publishedAt, title } = post
  const t = await getTranslations('post')

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  // Build gallery images: heroImage first, then additional gallery images
  const galleryImages: GalleryImage[] = []

  if (heroImage && typeof heroImage === 'object') {
    const url = getMediaUrl(heroImage.url, heroImage.updatedAt)
    if (url) galleryImages.push({ url, alt: heroImage.alt, width: heroImage.width, height: heroImage.height })
  }

  if (Array.isArray(gallery)) {
    for (const item of gallery) {
      if (item && typeof item === 'object') {
        const media = item as Media
        const url = getMediaUrl(media.url, media.updatedAt)
        if (url) galleryImages.push({ url, alt: media.alt, width: media.width, height: media.height })
      }
    }
  }

  return (
    <div className="relative">
      <div className="container z-10 relative pb-8">
        <div className="uppercase text-sm mb-6">
          {categories?.map((category, index) => {
            if (typeof category === 'object' && category !== null) {
              const { title: categoryTitle } = category
              const titleToUse = categoryTitle || 'Untitled category'
              const isLast = index === categories.length - 1

              return (
                <React.Fragment key={index}>
                  {titleToUse}
                  {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                </React.Fragment>
              )
            }
            return null
          })}
        </div>

        <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl font-bold">{title}</h1>

        <div className="flex flex-wrap items-end justify-between gap-4 md:gap-8">
          {hasAuthors && (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">{t('by')}</p>
              <p className="font-medium">{formatAuthors(populatedAuthors)}</p>
            </div>
          )}
          {publishedAt && (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">{t('datePublished')}</p>
              <time dateTime={publishedAt} className="font-medium">
                {formatDateTime(publishedAt)}
              </time>
            </div>
          )}
          <CopyLinkButton />
        </div>

        {galleryImages.length > 0 && (
          <div className="mt-8">
            <PostGallery images={galleryImages} />
          </div>
        )}

        {videoUrl && (
          <div className="mt-6">
            <PostVideoEmbed url={videoUrl} />
          </div>
        )}
      </div>
    </div>
  )
}
