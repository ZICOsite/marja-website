/**
 * Чинит названия марок, испорченные машинным переводом в карточках проектов.
 *
 * «ROOFIZOL ТПП» переводчик принял за аббревиатуру Торгово-промышленной палаты
 * и выдал «ROOFIZOL CCI» (Chamber of Commerce and Industry) — 36 строк в en, kk,
 * tg и uz. Марка — имя товара, переводу не подлежит.
 *
 * Чиним на латиницу (TPP), а не на кириллицу: в этих карточках соседние марки
 * записаны латиницей во всех локалях (ROOFIZOL EFP, IZOMEMBRANE EPP), и
 * кириллическое «ТПП» дало бы два алфавита внутри одной строки. В карточках,
 * переведённых scripts/translateProjects.ts, конвенция другая и они не затронуты:
 * там «CCI» не встречается.
 *
 * Запуск:
 *   pnpm tsx scripts/fixProjectMarks.ts             # показать правки
 *   APPLY=1 pnpm tsx scripts/fixProjectMarks.ts     # записать
 *
 * На сервере:
 *   docker compose --profile migrate run --rm -e APPLY=1 migrate \
 *     pnpm tsx scripts/fixProjectMarks.ts | tee marks-apply.log
 */
import dotenv from 'dotenv'
import { getPayload } from 'payload'

dotenv.config()

const APPLY = process.env.APPLY === '1'

const LOCALES = ['uz', 'ru', 'en', 'tg', 'kk'] as const
type Locale = (typeof LOCALES)[number]

/**
 * Испорченное написание → верное. Полный список получен инвентаризацией всех
 * обозначений после ROOFIZOL/IZOMEMBRANE в нерусских локалях, так что вслепую
 * ничего не заменяется: каждая строка сверена с русским оригиналом карточки.
 *
 * ТПП переводчик прочёл тремя разными способами: CCI (Торгово-промышленная
 * палата), IES (иссиқлик электр станцияси) и ПСС. ЭПП превратилась в ЭП,
 * ТКП в TCP, ЭКП в ECP.
 *
 * Порядок важен: точные формы идут раньше общего правила про РОФИЗОЛ.
 * У кириллических кусков вместо \b стоит lookahead — граница слова в JS
 * считается по ASCII и с кириллицей не срабатывает.
 */
const MARKS: [RegExp, string][] = [
  [/\bCCI\b/g, 'TPP'],
  [/ROOFIZOL(\s+)IES\b/g, 'ROOFIZOL$1TPP'],
  [/РОФИЗОЛ(\s+)ПСС(?=[;,.\s]|$)/g, 'ROOFIZOL$1TPP'],
  [/РОФИЗОЛ(\s+)ЭП(?=[;,.\s]|$)/g, 'ROOFIZOL$1EPP'],
  [/РОФИЗОЛ/g, 'ROOFIZOL'],
  [/\bTCP\b/g, 'TKP'],
  [/\bECP\b/g, 'EKP'],
]

const exitAfterFlush = async (code: number): Promise<never> => {
  await new Promise<void>((resolve) => process.stdout.write('', () => resolve()))
  process.exit(code)
}

const fix = (text: string): string => {
  let out = text
  for (const [from, to] of MARKS) out = out.replace(from, to)
  return out
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

  let touched = 0
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

      const title = row.title ? fix(String(row.title)) : row.title
      const description = row.description ? fix(String(row.description)) : row.description

      const changed = title !== row.title || description !== row.description
      if (!changed) continue

      console.log(`\nid ${doc.id} / ${locale}`)
      if (title !== row.title) console.log(`  было:  ${row.title}\n  стало: ${title}`)
      if (description !== row.description) {
        console.log(`  было:  ${String(row.description).replace(/\n/g, ' / ')}`)
        console.log(`  стало: ${String(description).replace(/\n/g, ' / ')}`)
      }

      touched++
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

  console.log(`\nИтого строк с правкой: ${touched}${APPLY ? ' — записаны' : ' (ничего не записано)'}`)
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
