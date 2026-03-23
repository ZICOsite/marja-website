import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateProduct: CollectionAfterChangeHook = ({
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
        // Ревалидируем корень каталога (список категорий мог измениться)
        revalidatePath(`/${locale}/products`)
      }
      // Тегированная ревалидация: страница товара использует этот тег
      revalidateTag(`product-${doc.slug}`)
      revalidateTag('products-sitemap')
      payload.logger.info(`Revalidated product: ${doc.slug}`)
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      for (const locale of locales) {
        revalidatePath(`/${locale}/products`)
      }
      revalidateTag(`product-${previousDoc.slug}`)
      revalidateTag('products-sitemap')
    }
  }
  return doc
}

export const revalidateDeleteProduct: CollectionAfterDeleteHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const locales = payload.config.localization
      ? payload.config.localization.locales.map((l) => (typeof l === 'string' ? l : l.code))
      : ['uz']

    for (const locale of locales) {
      revalidatePath(`/${locale}/products`)
    }
    revalidateTag(`product-${doc?.slug}`)
    revalidateTag('products-sitemap')
  }
  return doc
}
