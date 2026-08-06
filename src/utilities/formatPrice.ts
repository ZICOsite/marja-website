export const formatPrice = (value: number): string =>
  Math.round(value).toLocaleString('en-US').replace(/,/g, ' ')

type ProductPriceInput = {
  price: number
  currency?: string | null
  /** Готовая подпись единицы: «м²», «кг». Пусто — цена без единицы. */
  unitLabel?: string | null
}

/**
 * Цена товара с единицей измерения: «13 500 UZS/м²».
 *
 * Одна точка сборки на все места вывода (карточка каталога, страница товара,
 * корзина, блок популярных): без неё единица разъезжается по страницам и одно
 * и то же число выглядит по-разному.
 *
 * Приставку «от» подставляет вызывающий через `products.priceFrom` — в разных
 * локалях она стоит в разных местах строки («от 13 500» / «13 500 dan»),
 * поэтому склеивать её здесь нельзя.
 */
export const formatProductPrice = ({ price, currency, unitLabel }: ProductPriceInput): string => {
  const amount = `${formatPrice(price)} ${currency ?? 'UZS'}`
  return unitLabel ? `${amount}/${unitLabel}` : amount
}
