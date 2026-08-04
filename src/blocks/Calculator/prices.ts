/**
 * Цены для калькулятора — из карточек каталога, а не из констант в коде.
 *
 * Единственный источник правды по деньгам: менеджер правит цену в админке,
 * калькулятор подхватывает её на следующем рендере. Пересчёт каталожной цены
 * в единицу расчёта (рулон/кг/м²/м³) живёт в `catalogPriceToUnitPrice`.
 */
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import {
  CATALOG_SLUGS,
  PRODUCTS,
  catalogPriceToUnitPrice,
  type PriceMap,
  type ProductKey,
} from './calc'

/** slug каталога → ключ калькулятора. */
const KEY_BY_SLUG = new Map<string, ProductKey>(
  (Object.keys(PRODUCTS) as ProductKey[]).map((key) => [PRODUCTS[key].slug, key]),
)

const loadPrices = async (): Promise<PriceMap> => {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { in: CATALOG_SLUGS } },
    // Товаров под калькулятор около трёх десятков, запас на рост.
    limit: 200,
    pagination: false,
    depth: 0,
    select: { slug: true, price: true, priceOnRequest: true },
    // title локализован и обязателен, а заполнен не во всех локалях —
    // без явной локали Payload может отдать документ с пустым заголовком.
    // На цену это не влияет: price не локализован.
    locale: 'ru',
  })

  const prices: PriceMap = {}

  for (const doc of docs) {
    const key = doc.slug ? KEY_BY_SLUG.get(doc.slug) : undefined
    if (!key) continue

    // «Цена по запросу» — это осознанное отсутствие цены, а не ноль.
    if (doc.priceOnRequest || doc.price == null) continue

    const unitPrice = catalogPriceToUnitPrice(key, doc.price)
    if (unitPrice != null) prices[key] = unitPrice
  }

  return prices
}

/**
 * Кешируется до изменения любого товара: хук `revalidateProduct` сбрасывает
 * тег `calculator-prices`. Без кеша запрос уходил бы в БД на каждый рендер
 * главной страницы.
 */
export const fetchCatalogPrices = unstable_cache(loadPrices, ['calculator-prices'], {
  tags: ['calculator-prices'],
})
