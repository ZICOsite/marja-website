'use server'

import { sendTelegramNotification } from '@/services/notifications/telegram'
import { sendToCRM } from '@/services/notifications/crm'
import { deliverLead, recordLead } from '@/services/leads'
import { getClientIp } from '@/utilities/getClientIp'
import { allowRequest, isDuplicate } from '@/services/rateLimit'

/** См. пояснение к причинам в submitCalculatorRequest. */
export type OrderResult = { ok: boolean; reason?: 'rateLimited' }

export type OrderProduct = {
  title: string
  url?: string
  sku?: string | null
}

export type OrderInput = {
  name: string
  phone: string
  items: OrderProduct[]
  /** Honeypot: заполняется только ботами. */
  website?: string
}

export async function submitProductOrder(input: OrderInput): Promise<OrderResult> {
  const name = input?.name?.trim()
  const phone = input?.phone?.trim()
  const items = (input?.items ?? []).filter((it) => it?.title?.trim())

  // Basic server-side validation
  if (!name || !phone || items.length === 0) return { ok: false }
  if (name.length > 200 || phone.length > 50) return { ok: false }
  // Honeypot — молча подтверждаем, чтобы бот не подбирал обход.
  if (input?.website?.trim()) return { ok: true }

  // Порог и дубли отвечают ok, но ничего не шлют: спамер не должен нащупать границу,
  // а живой человек с двойным кликом — увидеть ошибку на нормальной заявке.
  // Дубль проверяем первым, чтобы двойной клик не расходовал попытку из лимита.
  if (isDuplicate(`order:${phone}:${items.map((it) => it.title).join('|')}`)) return { ok: true }

  const ip = await getClientIp()
  if (!allowRequest('order', ip)) return { ok: false, reason: 'rateLimited' }

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

  // Сначала БД, потом отправка — см. пояснение в submitCalculatorRequest.
  const leadId = await recordLead({
    source: 'order',
    name,
    phone,
    ip,
    details: submissionData,
  })

  await deliverLead(leadId, {
    telegram: () => sendTelegramNotification(submission),
    crm: () => sendToCRM(submission),
  })

  return { ok: true }
}
