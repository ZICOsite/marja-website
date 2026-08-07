/**
 * Переводит заново таджикские тексты в карточках проектов, испорченных
 * машинным переводом (id 5–35, 29 штук). Карточки с id 36 и дальше переведены
 * нормально и не трогаются — как и остальные локали.
 *
 * Что там было: «гидроизоляция» осталась английским словом посреди таджикского
 * текста («Корҳои Waterproofing»), праймер стал «Примери» и «Принсипи», марки
 * товаров превратились в ТЭЦ («Полиизол ТПП» → «ТЭЦ Полизол»), в двух строках
 * стояла украинская «ї» вместо таджикской «ӣ». Описание собирается заново из
 * русского оригинала — точечная правка тут не помогает, текст сломан целиком.
 *
 * Названия товаров взяты из src/i18n/messages/tg.json (calculator.materials):
 * марки в таджикском остаются кириллицей, как и в карточках, залитых
 * scripts/translateProjects.ts.
 *
 * Заголовки правятся точечно и только там, где дефект объективен: осталось
 * английское «Residential Complex», либо наоборот — переведено имя собственное.
 *
 * Запуск:
 *   pnpm tsx scripts/fixTajikProjects.ts             # показать правки
 *   APPLY=1 pnpm tsx scripts/fixTajikProjects.ts     # записать
 */
import dotenv from 'dotenv'
import { getPayload } from 'payload'

dotenv.config()

const APPLY = process.env.APPLY === '1'

/** Карточки со сломанным таджикским. Список получен проверкой всех 60 старых. */
const IDS = [
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30,
  31, 32, 33, 35,
]

/** Русский → таджикский. Длинные формулировки раньше коротких. */
const TERMS: [RegExp, string][] = [
  // Виды работ
  [/Типы\s+работ\s*:/gi, 'Намудҳои кор:'],
  [/Тип\s+работ\s*:/gi, 'Намуди кор:'],
  [/Поставка\s+гидроизоляционных\s+материалов/gi, 'Таъмини маводи гидроизолятсионӣ'],
  [/и\s+ремонтные\s+кровельные\s+работы/gi, 'ва корҳои таъмири бом'],
  [/Кровельные\s+гидроизоляционные\s+работы/gi, 'Корҳои гидроизолятсионии бом'],
  [/Гидроизоляция\s+фундамента\s+и\s+кровли/gi, 'Гидроизолятсияи таҳкурсӣ ва бом'],
  [/Гидроизоляционные\s+работы/gi, 'Корҳои гидроизолятсионӣ'],
  [/Формирование\s+кровельного\s+пирога/gi, 'Ташаккули қабатҳои бом'],
  // Заголовок списка материалов
  [/Материалы\s*:/gi, 'Мавод:'],
  [/Материал\s*:/gi, 'Мавод:'],
  [/Материал(?=\s|$)/g, 'Мавод'],
  // Товары
  [/Битумный\s+праймер\s+универсальный\s*№\s*1/gi, 'Праймери битумии универсалӣ №1'],
  [/Битумная\s+мастика\s+универсальная\s*№\s*1/gi, 'Мастикаи битумии универсалӣ №1'],
  [/Битумный\s+праймер\s+полимерный\s+MASTIFIX/gi, 'Праймери полимерии MASTIFIX'],
  [/Битумный\s+праймер\s+быстросохнущий/gi, 'Праймери битумии зудхушк'],
  [/Битумная\s+мастика\s+гидроизоляционная/gi, 'Мастикаи битумии гидроизолятсионӣ'],
  [/Битумная\s+мастика\s+(МБК-Г|МБР-75)/gi, 'Мастикаи битумии $1'],
  [/Битумная\s+мастика/gi, 'Мастикаи битумӣ'],
  [/Битумный\s+праймер/gi, 'Праймери битумӣ'],
  [/Битумная\s+эмульсия/gi, 'Эмулсияи битумӣ'],
  [/Геотекстиль\s+иглопробивной\s+полиэфирный/gi, 'Геотекстили сӯзанзадаи полиэфирӣ'],
  [/Профилированная\s+дренажная\s+мембрана\s+HPDE/gi, 'Мембранаи дренажии профилдори HPDE'],
  [/Пароизоляция/gi, 'Буғизолятсия'],
  // «Гидроизол Основа», «Гидроизол Фундамент», «Полиизол ТПП», «Изол ТПП»,
  // «Фольгоизол ТФП» и латинские марки — имена товаров, остаются как есть.
]

/**
 * Заголовки. Правится только объективный брак: непереведённое английское
 * «Residential Complex» и, наоборот, переведённые имена собственные.
 */
const TITLES: Record<number, string> = {
  5: 'Таваққуфгоҳи зеризаминии Infinity', // было «Infinity таваққуфгоҳи зеризаминии»
  8: 'Inter Engineering БОЙСУН ГПЗ', // название компании было переведено
  10: 'UZ AUTO TRAILER', // было «Трейлер худкор UZ» — переведено имя собственное
  13: 'Тарабхонаи «Сыроварня»', // «Сыроварня» стала «Ширин» (сладкий)
  14: 'Беморхонаи клиникии ҷумҳуриявӣ №1', // было No1
  17: 'Маъмурияти Ҷиззах', // было «Adm Jizah»
  18: 'Bomi Engineering Тошканд Сити',
  19: 'Маҷмааи истиқоматии Simplex',
  20: 'Маҷмааи истиқоматии Kokcha Darvoza',
  21: 'Маҷмааи истиқоматии Imarat Development Bristol',
  22: 'Маҷмааи истиқоматии NRG Yunusobod',
  25: 'Маҷмааи истиқоматии Ipak Yuli',
}

/** Разовая правка: в узбекском описании карточки 12 затесался «&». */
const UZ_STRAY_AMPERSAND = 12

const exitAfterFlush = async (code: number): Promise<never> => {
  await new Promise<void>((resolve) => process.stdout.write('', () => resolve()))
  process.exit(code)
}

const toTajik = (ru: string): string => {
  let out = ru
  for (const [from, to] of TERMS) out = out.replace(from, to)
  return out
}

const run = async () => {
  const config = (await import('@payload-config')).default
  const payload = await getPayload({ config })

  console.log(APPLY ? '=== РЕЖИМ ЗАПИСИ ===' : '=== СУХОЙ ПРОГОН (APPLY=1 — чтобы записать) ===')

  const read = async (id: number, locale: 'ru' | 'tg' | 'uz') => {
    const { docs } = await payload.find({
      collection: 'projects',
      where: { id: { equals: id } },
      locale,
      fallbackLocale: false,
      depth: 0,
      limit: 1,
    })
    return docs[0] as any
  }

  let changed = 0
  const failures: string[] = []

  for (const id of IDS) {
    const ru = await read(id, 'ru')
    const tg = await read(id, 'tg')
    if (!ru || !tg) {
      console.log(`id ${id}: карточка не найдена — пропуск`)
      failures.push(String(id))
      continue
    }

    const title = TITLES[id] ?? tg.title
    const description = ru.description ? toTajik(String(ru.description)) : tg.description

    if (title === tg.title && description === tg.description) {
      console.log(`id ${id}: без изменений`)
      continue
    }

    console.log(`\n--- id ${id}`)
    if (title !== tg.title) console.log(`  заголовок было:  ${tg.title}\n  заголовок стало: ${title}`)
    if (description !== tg.description) {
      console.log(`  было:  ${String(tg.description ?? '').replace(/\s*\n+\s*/g, ' | ')}`)
      console.log(`  стало: ${String(description ?? '').replace(/\s*\n+\s*/g, ' | ')}`)
    }

    changed++
    if (!APPLY) continue
    try {
      await payload.update({
        collection: 'projects',
        id,
        locale: 'tg',
        fallbackLocale: false,
        data: { title, description },
        context: { disableRevalidate: true },
      })
    } catch (e: any) {
      console.log(`  ОШИБКА — ${e?.message ?? e}`)
      failures.push(String(id))
    }
  }

  // Мусорный «&» в узбекском описании.
  const uz = await read(UZ_STRAY_AMPERSAND, 'uz')
  if (uz?.description?.includes('&')) {
    const fixed = String(uz.description).replace(/&(?=[;\s])/g, '')
    console.log(`\n--- id ${UZ_STRAY_AMPERSAND} / uz`)
    console.log(`  было:  ${String(uz.description).replace(/\s*\n+\s*/g, ' | ')}`)
    console.log(`  стало: ${fixed.replace(/\s*\n+\s*/g, ' | ')}`)
    changed++
    if (APPLY) {
      try {
        await payload.update({
          collection: 'projects',
          id: UZ_STRAY_AMPERSAND,
          locale: 'uz',
          fallbackLocale: false,
          data: { description: fixed },
          context: { disableRevalidate: true },
        })
      } catch (e: any) {
        console.log(`  ОШИБКА — ${e?.message ?? e}`)
        failures.push(`${UZ_STRAY_AMPERSAND}/uz`)
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
