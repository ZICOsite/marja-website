// Мета-описание товара с актуальной ценой.
//
// Раньше цена была вписана в meta.description руками («Цена от 11 500 сум.»)
// и устарела: на 20.10.2026 в 70 описаниях (ru/uz/en) цена в сниппете Google
// не совпадала с карточкой. Теперь предложение с ценой из текста вырезаем,
// а цену дописываем из полей товара — она всегда совпадает с сайтом.

const MAX_LENGTH = 158 // примерно столько Google показывает в сниппете

// Число вида «11 500» / «11,500» / «11500» + валюта (ru, uz, en, kk, tg)
const PRICE_IN_SENTENCE = /\d[\d\s\u00a0,.]*\d{3}.*?(сум|сўм|so['‘’ʻ`]?m|uzs|sum|сом)/iu

const splitSentences = (text: string): string[] =>
  text
    .match(/[^.!?]+[.!?]*/g)
    ?.map((s) => s.trim())
    .filter(Boolean) ?? []

/** Убирает предложения с ценой из текста, написанного в CMS. */
export const stripPriceSentences = (text: string): string =>
  splitSentences(text)
    .filter((s) => !PRICE_IN_SENTENCE.test(s))
    .join(' ')

/** Обрезает по границе слова, чтобы итог влез в MAX_LENGTH вместе с хвостом. */
const fitBody = (body: string, room: number): string => {
  if (body.length <= room) return body
  const cut = body.slice(0, room - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:—–-]+$/, '')}…`
}

/**
 * @param text      meta.description (или shortDescription как запасной вариант)
 * @param priceText готовое предложение с ценой («Цена от 16 000 UZS/кг.») или null
 */
export const buildProductMetaDescription = (
  text: string | null | undefined,
  priceText: string | null,
): string | undefined => {
  const body = stripPriceSentences((text ?? '').replace(/\s+/g, ' ').trim())
  if (!priceText) return body ? fitBody(body, MAX_LENGTH) : undefined
  if (!body) return priceText
  const room = MAX_LENGTH - priceText.length - 1
  return `${fitBody(body, room)} ${priceText}`
}
