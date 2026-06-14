'use server'

import { sendTelegramNotification } from '@/services/notifications/telegram'
import { sendToCRM } from '@/services/notifications/crm'

export type OrderResult = { ok: boolean }

export type OrderProduct = {
  title: string
  url?: string
  sku?: string | null
}

export type OrderInput = {
  name: string
  phone: string
  items: OrderProduct[]
}

export async function submitProductOrder(input: OrderInput): Promise<OrderResult> {
  const name = input?.name?.trim()
  const phone = input?.phone?.trim()
  const items = (input?.items ?? []).filter((it) => it?.title?.trim())

  // Basic server-side validation
  if (!name || !phone || items.length === 0) return { ok: false }
  if (name.length > 200 || phone.length > 50) return { ok: false }

  const productLines = items.map((it) => {
    const bits = [it.title.trim()]
    if (it.sku) bits.push(`арт. ${it.sku}`)
    if (it.url) bits.push(it.url)
    return bits.join(' — ')
  })

  const productField =
    items.length > 1
      ? { field: 'Товары', value: '\n' + productLines.map((l, i) => `${i + 1}. ${l}`).join('\n') }
      : { field: 'Товар', value: productLines[0]! }

  const submissionData = [
    { field: 'Имя', value: name },
    { field: 'Телефон', value: phone },
    productField,
  ]

  const submission = { submissionData, form: { title: 'Заявка на товар' } }

  // Both services swallow their own errors; allSettled guards against unexpected throws
  await Promise.allSettled([sendTelegramNotification(submission), sendToCRM(submission)])

  return { ok: true }
}
