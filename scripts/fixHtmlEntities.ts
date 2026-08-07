/**
 * Разворачивает HTML-сущности, попавшие в текст карточек проектов как обычные
 * символы: в узбекском описании карточки 16 вместо двух переносов строки стояло
 * «&#10;&#10;», и посетитель видел эту запись как есть.
 *
 * Проверено по всей коллекции: числовые сущности встречаются только там,
 * именованных (&amp; &quot; &nbsp;) нет вовсе.
 *
 * Запуск:
 *   pnpm tsx scripts/fixHtmlEntities.ts             # показать правки
 *   APPLY=1 pnpm tsx scripts/fixHtmlEntities.ts     # записать
 */
import dotenv from 'dotenv'
import { getPayload } from 'payload'

dotenv.config()

const APPLY = process.env.APPLY === '1'
const LOCALES = ['uz', 'ru', 'en', 'tg', 'kk'] as const

const decode = (text: string): string =>
  text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))

const exitAfterFlush = async (code: number): Promise<never> => {
  await new Promise<void>((resolve) => process.stdout.write('', () => resolve()))
  process.exit(code)
}

const run = async () => {
  const config = (await import('@payload-config')).default
  const payload = await getPayload({ config })

  console.log(APPLY ? '=== РЕЖИМ ЗАПИСИ ===' : '=== СУХОЙ ПРОГОН (APPLY=1 — чтобы записать) ===')

  const { docs } = await payload.find({
    collection: 'projects',
    locale: 'ru',
    depth: 0,
    limit: 500,
    pagination: false,
  })

  let changed = 0
  const failures: string[] = []

  for (const doc of docs as any[]) {
    for (const locale of LOCALES) {
      const { docs: one } = await payload.find({
        collection: 'projects',
        where: { id: { equals: doc.id } },
        locale,
        fallbackLocale: false,
        depth: 0,
        limit: 1,
      })
      const row: any = one[0]
      if (!row) continue

      const title = row.title ? decode(String(row.title)) : row.title
      const description = row.description ? decode(String(row.description)) : row.description
      if (title === row.title && description === row.description) continue

      console.log(`\n--- id ${doc.id} / ${locale}`)
      console.log(`  было:  ${String(row.description ?? row.title).replace(/\n/g, ' \\n ')}`)
      console.log(`  стало: ${String(description ?? title).replace(/\n/g, ' \\n ')}`)

      changed++
      if (!APPLY) continue
      try {
        await payload.update({
          collection: 'projects',
          id: doc.id,
          locale,
          fallbackLocale: false,
          data: { title, description },
          context: { disableRevalidate: true },
        })
      } catch (e: any) {
        console.log(`  ОШИБКА — ${e?.message ?? e}`)
        failures.push(`${doc.id}/${locale}`)
      }
    }
  }

  console.log(`\nИтого правок: ${changed}${APPLY ? ' — записаны' : ' (ничего не записано)'}`)
  if (failures.length) {
    console.log(`НЕ ЗАКРЫТО: ${failures.join(', ')}`)
    await exitAfterFlush(1)
  }
  await exitAfterFlush(0)
}

run().catch(async (e) => {
  console.error(e)
  await exitAfterFlush(1)
})
