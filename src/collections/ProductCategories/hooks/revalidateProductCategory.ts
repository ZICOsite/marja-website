import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { revalidateCatalogRoute } from '@/hooks/revalidateCatalog'

export const revalidateProductCategory: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    // Карточки товаров и категории (ISR)
    revalidateCatalogRoute()
    const locales = payload.config.localization
      ? payload.config.localization.locales.map((l) => (typeof l === 'string' ? l : l.code))
      : ['uz']

    const getBreadcrumbUrl = (d: typeof doc) => {
      const crumbs = d?.breadcrumbs
      return Array.isArray(crumbs) && crumbs.length > 0
        ? (crumbs[crumbs.length - 1] as { url?: string })?.url ?? `/${d.slug}`
        : `/${d.slug}`
    }

    if (doc._status === 'published') {
      const url = getBreadcrumbUrl(doc)
      for (const locale of locales) {
        const path = `/${locale}/products${url}`
        payload.logger.info(`Revalidating product category: ${path}`)
        revalidatePath(path)
        // Корень каталога (ISR) показывает дерево и карточки категорий
        revalidatePath(`/${locale}/products`)
      }
      revalidateTag('product-categories-sitemap')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const url = getBreadcrumbUrl(previousDoc)
      for (const locale of locales) {
        revalidatePath(`/${locale}/products${url}`)
        revalidatePath(`/${locale}/products`)
      }
      revalidateTag('product-categories-sitemap')
    }
  }
  return doc
}

export const revalidateDeleteProductCategory: CollectionAfterDeleteHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    // Карточки товаров и категории (ISR)
    revalidateCatalogRoute()
    const locales = payload.config.localization
      ? payload.config.localization.locales.map((l) => (typeof l === 'string' ? l : l.code))
      : ['uz']

    const crumbs = doc?.breadcrumbs
    const url =
      Array.isArray(crumbs) && crumbs.length > 0
        ? (crumbs[crumbs.length - 1] as { url?: string })?.url ?? `/${doc?.slug}`
        : `/${doc?.slug}`

    for (const locale of locales) {
      revalidatePath(`/${locale}/products${url}`)
      revalidatePath(`/${locale}/products`)
    }
    revalidateTag('product-categories-sitemap')
  }
  return doc
}
