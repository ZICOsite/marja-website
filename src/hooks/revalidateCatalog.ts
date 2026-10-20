import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

// Все карточки товаров и страницы категорий — один маршрут с ISR.
// Товар ссылается на категории, атрибуты, похожие товары, поэтому при любом
// изменении каталога сбрасываем маршрут целиком: страницы пересоберутся
// по первому запросу (их немного, это дёшево).
export const CATALOG_ROUTE = '/(frontend)/[slug]/products/[...path]'

export const revalidateCatalogRoute = () => {
  revalidatePath(CATALOG_ROUTE, 'page')
}

// Для коллекций, которые показываются в карточках (атрибуты, группы атрибутов).
export const revalidateCatalogAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) revalidateCatalogRoute()
  return doc
}

export const revalidateCatalogAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) revalidateCatalogRoute()
  return doc
}
