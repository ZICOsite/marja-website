/**
 * Разовый скрипт: обновляет цены в карточках каталога по прайсу.
 * Запуск: pnpm tsx scripts/updatePrices.ts
 */
import dotenv from 'dotenv'
import { getPayload } from 'payload'

// payload.config.ts читает process.env на этапе загрузки модуля, поэтому
// конфиг подключается динамически — уже после dotenv.
dotenv.config()

// Цена за м². Толщина 3 мм — согласовано, самая ходовая.
const PRICES: { slug: string; price: number }[] = [
  { slug: 'roofizol-tpp', price: 16_500 },
  { slug: 'roofizol-tfp', price: 19_500 },
  // Стояло 1 700 — потерянный ноль, соседние рулонные марки 17 000–22 000.
  { slug: 'folgoizol-tfp', price: 17_500 },
]

const run = async () => {
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })

  for (const { slug, price } of PRICES) {
    const { docs } = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      draft: false,
    })

    const doc = docs[0]
    if (!doc) {
      console.error(`НЕ НАЙДЕН: ${slug}`)
      continue
    }

    console.log(`${slug}: ${doc.price} -> ${price}`)

    await payload.update({
      collection: 'products',
      id: doc.id,
      data: { price, currency: 'UZS', priceOnRequest: false },
      // title локализован и обязателен, а у части товаров заполнен только ru —
      // без явной локали валидация падает на пустом uz. price не локализован,
      // поэтому значение всё равно применяется ко всем локалям.
      locale: 'ru',
      // revalidatePath работает только внутри запроса Next — вне его хук падает.
      context: { disableRevalidate: true },
    })
  }

  console.log('Готово.')
  process.exit(0)
}

void run()
