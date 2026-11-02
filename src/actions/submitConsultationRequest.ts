'use server'

import { sendTelegramNotification } from '@/services/notifications/telegram'
import { sendToAmoCRM } from '@/services/notifications/amocrm'
import { deliverLead, recordLead } from '@/services/leads'
import { getClientIp } from '@/utilities/getClientIp'
import { allowRequest, isDuplicate } from '@/services/rateLimit'
import { NO_NAME, isValidPhone } from '@/utilities/leadContact'

/** См. пояснение к причинам в submitCalculatorRequest. */
export type ConsultationResult = { ok: boolean; reason?: 'rateLimited' }

export type ConsultationInput = {
  /** Необязательно — см. NO_NAME. */
  name?: string
  phone: string
  /** Honeypot: заполняется только ботами. */
  website?: string
}

export async function submitConsultationRequest(
  input: ConsultationInput,
): Promise<ConsultationResult> {
  const name = input?.name?.trim() ?? ''
  const phone = input?.phone?.trim()

  if (!isValidPhone(phone)) return { ok: false }
  if (name.length > 200) return { ok: false }
  // Honeypot — молча подтверждаем, чтобы бот не подбирал обход.
  if (input?.website?.trim()) return { ok: true }

  // Порог и дубли отвечают ok, но ничего не шлют: спамер не должен нащупать границу,
  // а живой человек с двойным кликом — увидеть ошибку на нормальной заявке.
  // Дубль проверяем первым, чтобы двойной клик не расходовал попытку из лимита.
  if (isDuplicate(`consultation:${phone}`)) return { ok: true }

  const ip = await getClientIp()
  if (!allowRequest('consultation', ip)) return { ok: false, reason: 'rateLimited' }

  const submissionData = [
    ...(name ? [{ field: 'Имя', value: name }] : []),
    { field: 'Телефон', value: phone },
  ]

  const submission = { submissionData, form: { title: 'Заявка на консультацию' } }

  // Сначала БД, потом отправка — см. пояснение в submitCalculatorRequest.
  const leadId = await recordLead({
    source: 'consultation',
    name: name || NO_NAME,
    phone,
    ip,
    details: submissionData,
  })

  await deliverLead(leadId, {
    telegram: () => sendTelegramNotification(submission),
    crm: () => sendToAmoCRM(submission),
  })

  return { ok: true }
}
