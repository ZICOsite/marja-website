/**
 * Дозаполняет переводы карточек «Выполненные объекты».
 *
 * У Projects локализованы title и description. Часть карточек заведена только
 * по-русски — в остальных локалях они показываются русским текстом через фолбэк.
 * Скрипт переводит ТОЛЬКО пустые локали и никогда не трогает заполненные.
 *
 * Описания у этих карточек шаблонные: «Поставка материала:» и список марок.
 * Поэтому перевод собирается подстановкой терминов, а не пишется построчно:
 * так «Битумный праймер М/Т» переводится одинаково во всех 44 карточках.
 *
 * Названия марок следуют конвенции из src/i18n/messages/*.json:
 * в uz и en — латиница (Roofizol TPP), в tg и kk — кириллица (Roofizol ТПП).
 *
 * Запуск:
 *   pnpm tsx scripts/translateProjects.ts                    # показать перевод
 *   APPLY=1 pnpm tsx scripts/translateProjects.ts            # записать
 *
 * На сервере:
 *   docker compose --profile migrate run --rm migrate \
 *     pnpm tsx scripts/translateProjects.ts | tee projects-dryrun.log
 *   docker compose --profile migrate run --rm -e APPLY=1 migrate \
 *     pnpm tsx scripts/translateProjects.ts | tee projects-apply.log
 */
import dotenv from 'dotenv'
import { getPayload } from 'payload'

dotenv.config()

const APPLY = process.env.APPLY === '1'

const TARGETS = ['uz', 'en', 'tg', 'kk'] as const
type Target = (typeof TARGETS)[number]

type Phrase = Record<Target, string>

/**
 * Термины подставляются сверху вниз, поэтому длинные формулировки стоят раньше
 * коротких: «Битумный праймер быстросохнущий № 1» должен сработать до
 * «Битумный праймер», иначе от него останется хвост.
 */
const TERMS: { from: RegExp; to: Phrase }[] = [
  {
    from: /Поставка\s+материала\s*:/gi,
    to: {
      uz: 'Yetkazib berilgan material:',
      en: 'Material supplied:',
      tg: 'Маводи таъминшуда:',
      kk: 'Жеткізілген материал:',
    },
  },
  {
    from: /Поставка\s+гидроизоляционных\s+материалов/gi,
    to: {
      uz: 'Gidroizolyatsiya materiallarini yetkazib berish',
      en: 'Supply of waterproofing materials',
      tg: 'Таъмини маводҳои гидроизолятсионӣ',
      kk: 'Гидрооқшаулау материалдарын жеткізу',
    },
  },
  {
    from: /и\s+ремонтные\s+кровельные\s+работы/gi,
    to: {
      uz: 'va tom ta’mirlash ishlari',
      en: 'and roof repair works',
      tg: 'ва корҳои таъмири бом',
      kk: 'және шатырды жөндеу жұмыстары',
    },
  },
  {
    from: /Тип\s+работ\s*:/gi,
    to: {
      uz: 'Ish turi:',
      en: 'Type of work:',
      tg: 'Намуди кор:',
      kk: 'Жұмыс түрі:',
    },
  },
  // Раньше «Материал», иначе от строки останется отдельное слово «материал».
  {
    from: /Кровельный\s+материал\s+ИЗОФЛЕКС\s+ПФ/gi,
    to: {
      uz: 'IZOFLEKS PF tom materiali',
      en: 'IZOFLEX PF roofing material',
      tg: 'Маводи бомпӯши ИЗОФЛЕКС ПФ',
      kk: 'ИЗОФЛЕКС ПФ шатыр материалы',
    },
  },
  {
    from: /Гидроизоляционный\s+материал\s+геомембрана\s*\(геопленка\)\s*гладкая\s+толщиной/gi,
    to: {
      uz: 'Gidroizolyatsiya materiali — silliq geomembrana (geoplyonka), qalinligi',
      en: 'Waterproofing geomembrane (geofilm), smooth, thickness',
      tg: 'Маводи гидроизолятсионӣ — геомембранаи ҳамвор (геопленка), ғафсии',
      kk: 'Гидрооқшаулау материалы — тегіс геомембрана (геопленка), қалыңдығы',
    },
  },
  {
    from: /Мембрана\s+профилированная\s+полиэтиленовая\s+рулонная\s+толщиной/gi,
    to: {
      uz: 'Rulonli profilli polietilen membrana, qalinligi',
      en: 'Profiled polyethylene roll membrane, thickness',
      tg: 'Мембранаи рулонии профилдори полиэтиленӣ, ғафсии',
      kk: 'Орамалы профильді полиэтилен мембрана, қалыңдығы',
    },
  },
  {
    from: /Битумный\s+праймер\s+быстросохнущий\s*№\s*1/gi,
    to: {
      uz: 'Tez quriydigan bitumli praymer № 1',
      en: 'Fast-drying bitumen primer No. 1',
      tg: 'Праймери битумии зудхушкшаванда № 1',
      kk: 'Тез кебетін битум праймері № 1',
    },
  },
  {
    from: /Битумная\s+мастика\s+гидроизоляционная|Битумная\s+мастик(?!а)/gi,
    to: {
      uz: 'Bitumli gidroizolyatsiya mastikasi',
      en: 'Bitumen waterproofing mastic',
      tg: 'Мастикаи битумии гидроизолятсионӣ',
      kk: 'Битумды гидрооқшаулағыш мастика',
    },
  },
  {
    from: /Праймер\s+EXPORT/gi,
    to: {
      uz: 'EXPORT praymeri',
      en: 'EXPORT primer',
      tg: 'Праймери EXPORT',
      kk: 'EXPORT праймері',
    },
  },
  {
    from: /Битумный\s+праймер\s+MARJA/gi,
    to: {
      uz: 'MARJA bitumli praymeri',
      en: 'MARJA bitumen primer',
      tg: 'Праймери битумии MARJA',
      kk: 'MARJA битум праймері',
    },
  },
  // «Праймер битумная» — опечатка в исходных данных, тот же товар.
  {
    from: /Битумный\s+праймер|Праймер\s+битумная/gi,
    to: {
      uz: 'Bitumli praymer',
      en: 'Bitumen primer',
      tg: 'Праймери битумӣ',
      kk: 'Битум праймері',
    },
  },
  // Карточка 164 заведена наполовину по-узбекски. Правило регистрозависимое:
  // без этого оно повторно ловило «bitumli praymer», который сам же и подставил
  // предыдущий термин, и портило регистр в середине строки.
  {
    from: /Bitumli\s+Praymer/g,
    to: {
      uz: 'Bitumli praymer',
      en: 'Bitumen primer',
      tg: 'Праймери битумӣ',
      kk: 'Битум праймері',
    },
  },
  {
    from: /РУБЕРОИД\s+РКМ/gi,
    to: { uz: 'RUBEROID RKM', en: 'RUBEROID RKM', tg: 'РУБЕРОИД РКМ', kk: 'РУБЕРОИД РКМ' },
  },
  {
    from: /Битум\s+90\/10/gi,
    to: { uz: 'Bitum 90/10', en: 'Bitumen 90/10', tg: 'Битуми 90/10', kk: 'Битум 90/10' },
  },
  {
    from: /Нефрас/gi,
    to: { uz: 'Nefras', en: 'Nefras', tg: 'Нефрас', kk: 'Нефрас' },
  },
  // Одиночное «Материал» перед перечислением марок (карточка 169).
  // Без \b: в JS граница слова считается по ASCII, и с кириллицей не срабатывает —
  // на сухом прогоне это слово так и осталось русским.
  {
    from: /Материал(?=\s|$)/g,
    to: { uz: 'Material', en: 'Material', tg: 'Мавод', kk: 'Материал' },
  },
  // В исходных данных марка местами слиплась с обозначением: ROOFIZOLТФП.
  {
    from: /(ROOFIZOL|IZOMEMBRANE)(?=[ТЭ])/gi,
    to: { uz: '$1 ', en: '$1 ', tg: '$1 ', kk: '$1 ' },
  },
]

/**
 * Кириллические обозначения марок и сортов. В uz и en — латиница, в tg и kk
 * остаются как есть: так они записаны в переводах калькулятора.
 */
const LATIN: [RegExp, string][] = [
  [/ТПП/g, 'TPP'],
  [/ТФП/g, 'TFP'],
  [/ТКП/g, 'TKP'],
  [/ЭПП/g, 'EPP'],
  [/ЭКП/g, 'EKP'],
  [/ИЗОФЛЕКС/g, 'IZOFLEKS'],
  [/БН(?=\s*\d)/g, 'BN'],
  [/М\/Т/g, 'M/T'],
  [/М\/Б/g, 'M/B'],
  [/П\/Т/g, 'P/T'],
  [/(\d)\s*мм/g, '$1 mm'],
  [/\bмм\b/g, 'mm'],
]

/** Формы собственности в названиях. */
const LEGAL: { from: RegExp; to: Phrase }[] = [
  // Кириллическое ООО пишется без \b — с не-ASCII буквами граница слова не работает.
  { from: /\bOOO\b|ООО/g, to: { uz: 'MChJ', en: 'LLC', tg: 'ҶДММ', kk: 'ЖШС' } },
  { from: /\bMCHJ\b|\bMChJ\b/g, to: { uz: 'MChJ', en: 'LLC', tg: 'ҶДММ', kk: 'ЖШС' } },
  { from: /\bAJ\b/g, to: { uz: 'AJ', en: 'JSC', tg: 'ҶСК', kk: 'АҚ' } },
]

/** Названия, которые нужно перевести целиком, а не как имя собственное. */
const TITLES: Record<number, Phrase> = {
  129: {
    uz: 'Temir yo‘llar tarmog‘i — Mexanika zavodi',
    en: 'Railway Network — Mechanical Plant',
    tg: 'Шабакаи роҳи оҳан — Заводи механикӣ',
    kk: 'Темір жол желісі — Механикалық зауыт',
  },
  134: {
    uz: 'Toshkent metallurgiya zavodi',
    en: 'Tashkent Metallurgical Plant',
    tg: 'Заводи металлургии Тошканд',
    kk: 'Ташкент металлургия зауыты',
  },
  135: {
    uz: '«Angren IES» AJ',
    en: '“Angren IES” JSC',
    tg: 'ҶСК «Angren IES»',
    kk: '«Angren IES» АҚ',
  },
  147: {
    uz: '«Yangi Toshkent» Milliy teatri',
    en: '“Yangi Toshkent” National Theatre',
    tg: 'Театри миллии «Yangi Toshkent»',
    kk: '«Yangi Toshkent» Ұлттық театры',
  },
  156: {
    // Узбекское название, записанное кириллицей. Для uz и en — латиница.
    uz: 'HUDUDIY ELEKTR TARMOQLARI',
    en: 'HUDUDIY ELEKTR TARMOQLARI',
    tg: 'ХУДУДИЙ ЭЛЭКТР ТАРМОКЛАРИ',
    kk: 'ХУДУДИЙ ЭЛЭКТР ТАРМОКЛАРИ',
  },
}

const translate = (text: string, locale: Target): string => {
  let out = text
  for (const { from, to } of TERMS) out = out.replace(from, to[locale])
  if (locale === 'uz' || locale === 'en') {
    for (const [from, to] of LATIN) out = out.replace(from, to)
  }
  return out
}

const translateTitle = (id: number, ruTitle: string, locale: Target): string => {
  if (TITLES[id]) return TITLES[id][locale]
  let out = ruTitle
  for (const { from, to } of LEGAL) out = out.replace(from, to[locale])
  return out
}

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
    fallbackLocale: false,
    depth: 0,
    limit: 500,
    pagination: false,
  })

  let filled = 0
  let skipped = 0
  const failures: string[] = []

  for (const doc of docs as any[]) {
    // Какие локали пустые. Без fallbackLocale: false здесь всё выглядело бы заполненным.
    const missing: Target[] = []
    for (const locale of TARGETS) {
      const { docs: one } = await payload.find({
        collection: 'projects',
        where: { id: { equals: doc.id } },
        locale,
        fallbackLocale: false,
        depth: 0,
        limit: 1,
      })
      const t = (one[0] as any)?.title
      if (!t || !String(t).trim()) missing.push(locale)
    }

    if (!missing.length) {
      skipped++
      continue
    }

    console.log(`\n--- id ${doc.id} — ${doc.title} (нет: ${missing.join(', ')})`)

    for (const locale of missing) {
      const title = translateTitle(doc.id, String(doc.title ?? ''), locale)
      const description = doc.description ? translate(String(doc.description), locale) : undefined

      console.log(`  ${locale}: ${title}`)
      if (description) console.log(`      ${description.replace(/\n/g, ' / ')}`)

      if (!APPLY) continue
      try {
        await payload.update({
          collection: 'projects',
          id: doc.id,
          locale,
          fallbackLocale: false,
          data: description ? { title, description } : { title },
          context: { disableRevalidate: true },
        })
        filled++
      } catch (e: any) {
        console.log(`      ОШИБКА — ${e?.message ?? e}`)
        failures.push(`${doc.id}/${locale}`)
      }
    }
  }

  console.log(
    `\nИтого: карточек всего ${docs.length}, уже переведены ${skipped}, ` +
      (APPLY ? `записано переводов ${filled}` : 'ничего не записано'),
  )
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
