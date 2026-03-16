import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const locales = payload.config.localization
      ? payload.config.localization.locales.map((l) => (typeof l === 'string' ? l : l.code))
      : ['uz']

    if (doc._status === 'published') {
      for (const locale of locales) {
        const path = `/${locale}/posts/${doc.slug}`
        payload.logger.info(`Revalidating post at path: ${path}`)
        revalidatePath(path)
      }
      revalidateTag('posts-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      for (const locale of locales) {
        const oldPath = `/${locale}/posts/${previousDoc.slug}`
        payload.logger.info(`Revalidating old post at path: ${oldPath}`)
        revalidatePath(oldPath)
      }
      revalidateTag('posts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const locales = payload.config.localization
      ? payload.config.localization.locales.map((l) => (typeof l === 'string' ? l : l.code))
      : ['uz']

    for (const locale of locales) {
      const path = `/${locale}/posts/${doc?.slug}`
      revalidatePath(path)
    }
    revalidateTag('posts-sitemap')
  }

  return doc
}
