import { getPayload } from 'payload'
import config from '@payload-config'

import type { DeliveryStatus, SubmissionField } from './notifications/types'

export type LeadSource = 'calculator' | 'consultation' | 'order'

export type LeadRecord = {
  source: LeadSource
  name: string
  phone: string
  city?: string
  timing?: 'now' | 'month' | 'quarter'
  comment?: string
  /** Площадь и сумма — только у калькулятора, нужны для сортировки крупных заявок. */
  area?: number
  amount?: number
  locale?: string
  ip?: string
  /** Снимок того, что уходит менеджерам, — сохраняем как есть. */
  details: SubmissionField[]
}

export type LeadId = number | string

/**
 * Сохраняет заявку до отправки в Telegram и CRM.
 *
 * Никогда не бросает исключение и не возвращает отказ: если БД недоступна,
 * заявка всё равно должна уйти менеджерам. Иначе страховка от потери лидов
 * сама становилась бы причиной их потери.
 *
 * `null` означает, что записать не удалось, — вызывающий просто идёт дальше.
 */
export async function recordLead(lead: LeadRecord): Promise<LeadId | null> {
  try {
    const payload = await getPayload({ config })

    // Пользователь не передаётся: пишет сервер, поэтому access специально обходится
    // (create в коллекции закрыт от публики).
    const doc = await payload.create({
      collection: 'leads',
      data: {
        source: lead.source,
        name: lead.name,
        phone: lead.phone,
        city: lead.city || undefined,
        timing: lead.timing,
        comment: lead.comment || undefined,
        area: lead.area,
        amount: lead.amount,
        locale: lead.locale || undefined,
        ip: lead.ip || undefined,
        deliveryStatus: 'pending',
        telegramStatus: 'pending',
        crmStatus: 'pending',
        // Пустые поля в форму не попадают, а переносы строк нужны только
        // для вида в Telegram — в архиве они лишние.
        details: lead.details
          .filter(({ value }) => value !== undefined && value !== null && String(value).trim())
          .map(({ field, value }) => ({ label: field, value: String(value).trim() })),
      },
    })

    return doc.id
  } catch (err) {
    console.error('[Leads] Не удалось сохранить заявку:', err)
    return null
  }
}

/**
 * Итоговый статус заявки по каналам.
 *
 * Ненастроенный канал (`skipped`) в расчёт не берём — он ничего не обещал.
 * Но если не настроен ни один, заявка реально никуда не ушла, и это `failed`:
 * забытая переменная окружения на проде должна быть видна как потерянный лид.
 */
function overallStatus(statuses: DeliveryStatus[]): 'delivered' | 'partial' | 'failed' {
  const attempted = statuses.filter((status) => status !== 'skipped')

  if (attempted.length === 0) return 'failed'
  if (attempted.every((status) => status === 'sent')) return 'delivered'
  if (attempted.some((status) => status === 'sent')) return 'partial'

  return 'failed'
}

/**
 * Отмечает, чем закончилась доставка. Тоже не бросает: заявка уже у менеджеров,
 * падать из-за неудачной отметки бессмысленно.
 */
export async function markLeadDelivery(
  id: LeadId | null,
  statuses: { telegram: DeliveryStatus; crm: DeliveryStatus },
): Promise<void> {
  if (id === null) return

  try {
    const payload = await getPayload({ config })

    await payload.update({
      collection: 'leads',
      id,
      data: {
        telegramStatus: statuses.telegram,
        crmStatus: statuses.crm,
        deliveryStatus: overallStatus([statuses.telegram, statuses.crm]),
      },
    })
  } catch (err) {
    console.error('[Leads] Не удалось отметить доставку заявки:', id, err)
  }
}

/**
 * Отправляет заявку в оба канала и записывает результат.
 *
 * Единая точка для всех форм: порядок «сначала БД, потом отправка, потом отметка»
 * должен быть одинаковым везде, иначе новая форма легко потеряет страховку.
 */
export async function deliverLead(
  id: LeadId | null,
  send: {
    telegram: () => Promise<DeliveryStatus>
    crm: () => Promise<DeliveryStatus>
  },
): Promise<void> {
  const [telegram, crm] = await Promise.all([
    send.telegram().catch((err): DeliveryStatus => {
      console.error('[Telegram] Unexpected error:', err)
      return 'failed'
    }),
    send.crm().catch((err): DeliveryStatus => {
      console.error('[CRM] Unexpected error:', err)
      return 'failed'
    }),
  ])

  await markLeadDelivery(id, { telegram, crm })
}
