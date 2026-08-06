/**
 * Разовый скрипт: проставляет единицу измерения цены всем товарам и включает
 * «цену от» тем маркам, что выпускаются в нескольких толщинах.
 *
 * Запуск: pnpm tsx scripts/setPriceUnits.ts
 */
import dotenv from 'dotenv'
import { getPayload } from 'payload'

// payload.config.ts читает process.env на этапе загрузки модуля, поэтому
// конфиг подключается динамически — уже после dotenv.
dotenv.config()

type PriceUnit = 'm2' | 'kg' | 'roll' | 'm3' | 'lm' | 'pcs'

/**
 * Единица берётся по тому, как задана цена в каталоге: рулонные и листовые
 * материалы — за м² полотна, наливные и обмазочные — за килограмм.
 */
const UNIT_BY_PREFIX: { match: RegExp; unit: PriceUnit }[] = [
  { match: /^(roofizol|izomembrane|izmembrane|folgoizol|poliizol|izol-|gidroizol-)/, unit: 'm2' },
  { match: /(membran|geotekstil|getotekstil|geomembrana|paroizolyacziya)/, unit: 'm2' },
  { match: /^(penopleks|basalt-wool)/, unit: 'm2' },
  { match: /(mastika|prajmer|germetik|bitum|lak|emulsiya)/, unit: 'kg' },
]

/** Марки с прайсом по толщинам: в каталоге лежит цена самой тонкой. */
const PRICE_FROM: { slug: string; price: number }[] = [
  // ТПП: 13 500 / 16 500 / 22 500 за 2 / 3 / 4 мм
  { slug: 'roofizol-tpp', price: 13_500 },
  // ТФП: 16 500 / 19 500 / 25 000 за 2 / 3 / 4 мм
  { slug: 'roofizol-tfp', price: 16_500 },
]

const run = async () => {
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })

  const { docs } = await payload.find({ collection: 'products', limit: 200, draft: false })
  const priceFromBySlug = new Map(PRICE_FROM.map((p) => [p.slug, p.price]))

  let units = 0
  const noUnit: string[] = []

  for (const doc of docs) {
    const slug = doc.slug ?? ''
    const unit = UNIT_BY_PREFIX.find(({ match }) => match.test(slug))?.unit
    const priceFrom = priceFromBySlug.get(slug)

    if (!unit) {
      noUnit.push(slug)
      continue
    }

    await payload.update({
      collection: 'products',
      id: doc.id,
      data: {
        priceUnit: unit,
        ...(priceFrom != null ? { price: priceFrom, priceFrom: true } : {}),
      },
      // title локализован и обязателен, а у части товаров заполнен только ru —
      // без явной локали валидация падает на пустом uz.
      locale: 'ru',
      // revalidatePath работает только внутри запроса Next — вне его хук падает.
      context: { disableRevalidate: true },
    })
    units++

    if (priceFrom != null) console.log(`${slug}: цена ${doc.price} -> ${priceFrom}, «от», ${unit}`)
  }

  console.log(`\nединица проставлена: ${units} из ${docs.length}`)
  if (noUnit.length) console.log('без единицы (правило не подошло):', noUnit.join(', '))
  process.exit(0)
}

void run()
