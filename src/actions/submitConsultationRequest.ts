'use server'

import { sendTelegramNotification } from '@/services/notifications/telegram'
import { sendToCRM } from '@/services/notifications/crm'
import { deliverLead, recordLead } from '@/services/leads'
import { getClientIp } from '@/utilities/getClientIp'
import { allowRequest, isDuplicate } from '@/services/rateLimit'

/** См. пояснение к причинам в submitCalculatorRequest. */
export type ConsultationResult = { ok: boolean; reason?: 'rateLimited' }

export type ConsultationInput = {
  name: string
  phone: string
  /** Honeypot: заполняется только ботами. */
  website?: string
}

export async function submitConsultationRequest(
  input: ConsultationInput,
): Promise<ConsultationResult> {
  const name = input?.name?.trim()
  const phone = input?.phone?.trim()

  if (!name || !phone) return { ok: false }
  if (name.length > 200 || phone.length > 50) return { ok: false }
  // Honeypot — молча подтверждаем, чтобы бот не подбирал обход.
  if (input?.website?.trim()) return { ok: true }

  // Порог и дубли отвечают ok, но ничего не шлют: спамер не должен нащупать границу,
  // а живой человек с двойным кликом — увидеть ошибку на нормальной заявке.
  // Дубль проверяем первым, чтобы двойной клик не расходовал попытку из лимита.
  if (isDuplicate(`consultation:${phone}`)) return { ok: true }

  const ip = await getClientIp()
  if (!allowRequest('consultation', ip)) return { ok: false, reason: 'rateLimited' }

  const submissionData = [
    { field: 'Имя', value: name },
    { field: 'Телефон', value: phone },
  ]

  const submission = { submissionData, form: { title: 'Заявка на консультацию' } }

  // Сначала БД, потом отправка — см. пояснение в submitCalculatorRequest.
  const leadId = await recordLead({
    source: 'consultation',
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
