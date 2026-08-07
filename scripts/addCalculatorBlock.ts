/**
 * Ставит блок «Калькулятор объекта» на главную в локалях uz, en, tg, kk —
 * сразу после блока solutions, как это сделано в ru.
 *
 * layout у Pages локализован: блок, добавленный в админке на одном языке,
 * в остальные не попадает. Контент живёт в БД и миграциями не переносится,
 * поэтому на прод правка едет этим скриптом, а не деплоем.
 *
 * Запуск локально:
 *   pnpm tsx scripts/addCalculatorBlock.ts            # сухой прогон
 *   APPLY=1 pnpm tsx scripts/addCalculatorBlock.ts
 *
 * Запуск на сервере (образ migrator содержит исходники и dev-зависимости):
 *   docker compose --profile migrate build migrate
 *   docker compose --profile migrate run --rm migrate \
 *     pnpm tsx scripts/addCalculatorBlock.ts | tee calc-block-dryrun.log
 *   docker compose --profile migrate run --rm -e APPLY=1 migrate \
 *     pnpm tsx scripts/addCalculatorBlock.ts | tee calc-block-apply.log
 *
 * Переменные:
 *   APPLY=1    — записать изменения (без неё только показывает план)
 *   MOVE_RU=1  — заодно перенести уже существующий блок в ru на ту же позицию
 *
 * Скрипт идемпотентен: локаль, где блок уже стоит, пропускается.
 * Настройки блока (showPrices, disclaimer) копируются из ru — на проде галка
 * цен выключена, значит и остальные локали получат её выключенной.
 */
import dotenv from 'dotenv'
import { getPayload } from 'payload'

dotenv.config()

const APPLY = process.env.APPLY === '1'
const MOVE_RU = process.env.MOVE_RU === '1'

const LOCALES = ['ru', 'uz', 'en', 'tg', 'kk'] as const
type Locale = (typeof LOCALES)[number]

const TARGETS: Locale[] = ['uz', 'en', 'tg', 'kk']

/** Терминология выверена по src/i18n/messages/*.json — там же переведён сам калькулятор. */
const CONTENT: Record<string, { tagline: string; heading: string; description: string }> = {
  uz: {
    tagline: 'Hisoblang',
    heading: 'Obyektingiz uchun materiallarni hisoblang',
    description:
      'Maydon, asos va gidroizolyatsiya usulini ko‘rsating — kalkulyator qoplama tarkibini tanlab, materiallar hajmini hisoblab beradi. Aniq smetani menejer tayyorlaydi.',
  },
  en: {
    tagline: 'Calculate',
    heading: 'Calculate the materials for your project',
    description:
      'Enter the area, substrate and waterproofing method — the calculator will build the coating system and work out how much material you need. An exact quote is prepared by a manager.',
  },
  tg: {
    tagline: 'Ҳисоб кунед',
    heading: 'Барои объекти худ маводро ҳисоб кунед',
    description:
      'Масоҳат, асос ва тарзи гидроизолятсияро нишон диҳед — калкулятор таркиби пӯшишро интихоб карда, ҳаҷми маводро ҳисоб мекунад. Сметаи дақиқро менеҷер тайёр мекунад.',
  },
  kk: {
    tagline: 'Есептеңіз',
    heading: 'Нысаныңызға арналған материалдарды есептеңіз',
    description:
      'Ауданын, негізін және гидрооқшаулау тәсілін көрсетіңіз — калькулятор жабын құрамын таңдап, материал көлемін есептеп береді. Нақты сметаны менеджер дайындайды.',
  },
}

const run = async () => {
  // payload.config.ts читает process.env при загрузке модуля — импорт после dotenv.
  const config = (await import('@payload-config')).default
  const payload = await getPayload({ config })

  const fetchPage = async (locale: Locale) => {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      locale,
      // Без этого незаполненный перевод молча подменяется русским,
      // и в локаль уехал бы русский текст соседних блоков.
      fallbackLocale: false,
      depth: 0,
      limit: 1,
    })
    const page = docs[0] as any
    if (!page) throw new Error(`Не найдена страница home в локали ${locale}`)
    return page
  }

  console.log(APPLY ? '=== РЕЖИМ ЗАПИСИ ===' : '=== СУХОЙ ПРОГОН (APPLY=1 — чтобы записать) ===')
  console.log(`База: ${(process.env.DATABASE_URL ?? '').replace(/:[^:@/]*@/, ':***@')}\n`)

  const before: Record<string, any> = {}
  for (const locale of LOCALES) before[locale] = await fetchPage(locale)

  console.log('--- БЭКАП layout ДО ПРАВКИ (json) ---')
  console.log(JSON.stringify(before, null, 2))
  console.log('--- КОНЕЦ БЭКАПА ---\n')

  const ruLayout: any[] = before.ru.layout ?? []
  const ruCalc = ruLayout.find((b) => b.blockType === 'calculator')
  if (!ruCalc) throw new Error('В ru нет блока calculator — не с чего копировать настройки')
  console.log(
    `Шаблон из ru: showPrices=${ruCalc.showPrices}, disclaimer=${ruCalc.disclaimer ? 'задан' : 'пусто'}\n`,
  )

  const failures: string[] = []

  const writeLayout = async (locale: Locale, id: number | string, layout: any[]) => {
    await payload.update({
      collection: 'pages',
      id,
      locale,
      fallbackLocale: false,
      data: { layout },
      // revalidatePage зовёт revalidatePath, а он живёт только внутри запроса Next.
      // Страницы отдаются force-dynamic, так что чистить кеш и не нужно.
      context: { disableRevalidate: true },
    })
  }

  for (const locale of TARGETS) {
    const page = before[locale]
    const layout: any[] = page.layout ?? []

    if (layout.some((b) => b.blockType === 'calculator')) {
      console.log(`${locale}: блок уже стоит — пропускаю`)
      continue
    }

    const at = layout.findIndex((b) => b.blockType === 'solutions')
    if (at === -1) {
      console.log(`${locale}: ПРОПУСК — нет блока solutions, некуда привязаться. Поставьте вручную.`)
      failures.push(locale)
      continue
    }

    const block = {
      blockType: 'calculator',
      ...CONTENT[locale],
      showPrices: ruCalc.showPrices,
      disclaimer: ruCalc.disclaimer ?? null,
      blockName: null,
    }
    const next = [...layout.slice(0, at + 1), block, ...layout.slice(at + 1)]

    console.log(
      `${locale}: позиция ${at + 2} из ${next.length} → ${next.map((b) => b.blockType).join(', ')}`,
    )

    if (!APPLY) continue
    try {
      await writeLayout(locale, page.id, next)
      console.log(`${locale}: записано`)
    } catch (e: any) {
      console.log(`${locale}: ОШИБКА — ${e?.message ?? e}`)
      failures.push(locale)
    }
  }

  // ru: блок уже есть, вопрос только в его месте.
  const ruAt = ruLayout.findIndex((b) => b.blockType === 'calculator')
  const ruSolutions = ruLayout.findIndex((b) => b.blockType === 'solutions')
  if (ruAt === ruSolutions + 1) {
    console.log(`\nru: блок уже на позиции ${ruAt + 1}, сразу после solutions — не трогаю`)
  } else if (!MOVE_RU) {
    console.log(
      `\nru: блок на позиции ${ruAt + 1} из ${ruLayout.length}, а solutions — ${ruSolutions + 1}.` +
        ' Перенести на ту же позицию, что и в остальных локалях: MOVE_RU=1',
    )
  } else {
    const without = ruLayout.filter((_, i) => i !== ruAt)
    const target = without.findIndex((b) => b.blockType === 'solutions')
    const next = [...without.slice(0, target + 1), ruLayout[ruAt], ...without.slice(target + 1)]
    console.log(
      `\nru: перенос ${ruAt + 1} → ${target + 2} из ${next.length} → ${next.map((b) => b.blockType).join(', ')}`,
    )
    if (APPLY) {
      try {
        await writeLayout('ru', before.ru.id, next)
        console.log('ru: записано')
      } catch (e: any) {
        console.log(`ru: ОШИБКА — ${e?.message ?? e}`)
        failures.push('ru')
      }
    }
  }

  // Сверка по факту записи: порядок блоков и что соседи не поехали.
  if (APPLY) {
    console.log('\n--- ПОСЛЕ ПРАВКИ ---')
    for (const locale of LOCALES) {
      const page = await fetchPage(locale)
      const types: string[] = (page.layout ?? []).map((b: any) => b.blockType)
      const wasTypes: string[] = (before[locale].layout ?? []).map((b: any) => b.blockType)
      const calc = (page.layout ?? []).find((b: any) => b.blockType === 'calculator')

      // Соседи целы, если убрать добавленный блок и получить прежний список.
      const idx = types.indexOf('calculator')
      const stripped = wasTypes.includes('calculator') ? types : types.filter((_, i) => i !== idx)
      const intact = JSON.stringify(stripped.filter((t) => t !== 'calculator')) ===
        JSON.stringify(wasTypes.filter((t) => t !== 'calculator'))

      console.log(`${locale} (${types.length}, _status=${page._status}): ${types.join(', ')}`)
      console.log(`   соседние блоки целы: ${intact ? 'да' : 'НЕТ — сверьте с бэкапом выше'}`)
      if (calc) console.log(`   heading: "${calc.heading}" | showPrices=${calc.showPrices}`)
    }
  }

  if (failures.length) {
    console.log(`\nНЕ ЗАКРЫТО: ${failures.join(', ')}`)
    process.exit(1)
  }

  console.log(
    APPLY
      ? '\nГотово. Страницы отдаются force-dynamic — перезапуск app не нужен.'
      : '\nНичего не записано. Повторите с APPLY=1.',
  )
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
