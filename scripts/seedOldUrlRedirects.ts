/**
 * Вторая волна SEO-редиректов: карта ПЕРЕВЕДЁННЫХ слагов старого сайта.
 *
 * Старый WordPress с плагином автоперевода отдавал каждый товар под пятью
 * префиксами локалей с переведённым слагом. Первая волна (redirects.js)
 * починила только ФОРМУ пути: /tg/product/<slug> -> /tg/products/<slug>.
 * Сам слаг остался переведённым, поэтому такие URL по-прежнему отдают 404.
 *
 * Карта лежит в scripts/data/oldSlugMap.ts. Данные собраны из лога nginx за
 * 04.06-14.08.2026 и проверены curl'ом: из 202 уникальных старых слагов 50 уже
 * отдавали 200 после первой волны, 5 уходили дальше по 308, а 147 оставались
 * битыми — они и перечислены в карте.
 *
 * Записи кладутся в коллекцию `redirects`, поэтому пересобирать образ
 * приложения не нужно.
 *
 * ВАЖНО: запись идёт с `context.disableRevalidate` — `revalidateTag` работает
 * только внутри запроса Next и из скрипта бросает «Invariant: static generation
 * store missing», роняя саму операцию. Значит кэш `unstable_cache` в работающем
 * приложении сам не обновится, и после заливки нужен перезапуск:
 *   docker compose restart app
 * Правки из админки этого не требуют — там хук отрабатывает как обычно.
 *
 * Запуск:
 *   pnpm tsx scripts/seedOldUrlRedirects.ts           # сухой прогон
 *   APPLY=1 pnpm tsx scripts/seedOldUrlRedirects.ts   # записать
 *
 * На сервере — через образ migrate (его надо пересобрать после git pull):
 *   docker compose --profile migrate build migrate
 *   docker compose --profile migrate run --rm -T -e APPLY=1 migrate \
 *     pnpm tsx scripts/seedOldUrlRedirects.ts
 */
import dotenv from 'dotenv'
import { getPayload } from 'payload'

import { MAP, FEED_PARENTS } from './data/oldSlugMap'

dotenv.config()

const APPLY = process.env.APPLY === '1'
const LOCALES = ['uz', 'ru', 'en', 'tg', 'kk'] as const

const exitAfterFlush = async (code: number): Promise<never> => {
  await new Promise<void>((resolve) => process.stdout.write('', () => resolve()))
  process.exit(code)
}

type Pair = { from: string; to: string }

const buildPairs = (): Pair[] => {
  const pairs: Pair[] = []
  const seen = new Set<string>()

  const add = (from: string, to: string) => {
    if (from === to || seen.has(from)) return
    seen.add(from)
    pairs.push({ from, to })
  }

  for (const locale of LOCALES) {
    for (const [target, oldSlugs] of Object.entries(MAP)) {
      for (const oldSlug of oldSlugs) {
        const to = `/${locale}/products/${target}`

        add(`/${locale}/products/${oldSlug}`, to)

        // Маршрут получает сегменты пути НЕ декодированными — ровно поэтому
        // соседний [contentSlug]/page.tsx зовёт decodeURIComponent руками.
        // Таджикские слаги кириллические, поэтому для них нужен ещё и
        // percent-encoded вариант `from`, иначе сравнение не совпадёт.
        // encodeURI, а не encodeURIComponent: слэши внутри слага сохраняем.
        const encoded = encodeURI(oldSlug)
        if (encoded !== oldSlug) add(`/${locale}/products/${encoded}`, to)
      }
    }

    for (const parent of FEED_PARENTS) {
      add(`/${locale}/products/${parent}/feed`, `/${locale}/products/${parent}`)
    }
  }

  return pairs
}

const run = async () => {
  const config = (await import('@payload-config')).default
  const payload = await getPayload({ config })

  console.log(APPLY ? '=== РЕЖИМ ЗАПИСИ ===' : '=== СУХОЙ ПРОГОН (APPLY=1 — чтобы записать) ===')

  const pairs = buildPairs()

  const { docs: existing } = await payload.find({
    collection: 'redirects',
    depth: 0,
    limit: 0,
    pagination: false,
  })

  const byFrom = new Map(existing.map((d) => [d.from, d]))

  let created = 0
  let updated = 0
  let unchanged = 0

  for (const { from, to } of pairs) {
    const current = byFrom.get(from)

    if (!current) {
      if (APPLY) {
        await payload.create({
          collection: 'redirects',
          data: { from, to: { type: 'custom', url: to } },
          context: { disableRevalidate: true },
        })
      }
      created++
      continue
    }

    if (current.to?.url === to) {
      unchanged++
      continue
    }

    if (APPLY) {
      await payload.update({
        collection: 'redirects',
        id: current.id,
        data: { to: { type: 'custom', url: to } },
        context: { disableRevalidate: true },
      })
    }
    updated++
  }

  // Записи, чей `from` до PayloadRedirects не доходит: пути вида
  // /{locale}/product/... или /{locale}/mahsulot/... перехватывает
  // redirects.js ещё на эдже, а /{locale}/product-category/... — тоже.
  // Такое правило не сработает никогда, его надо переписать на /products/.
  const stale = existing.filter(
    (d) =>
      typeof d.from === 'string' &&
      /^\/(uz|ru|en|tg|kk)\/(product|mahsulot|product-category)\//.test(d.from),
  )

  console.log(`правил в карте:  ${pairs.length}`)
  console.log(`создать:         ${created}`)
  console.log(`обновить:        ${updated}`)
  console.log(`уже верны:       ${unchanged}`)
  console.log(`мёртвые записи:  ${stale.length}`)
  for (const s of stale) {
    console.log(`  не сработает никогда: ${s.from} -> ${s.to?.url ?? '?'}`)
  }

  await exitAfterFlush(0)
}

run().catch(async (e) => {
  console.error(e)
  await exitAfterFlush(1)
})
