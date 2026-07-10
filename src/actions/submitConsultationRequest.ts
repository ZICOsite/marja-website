'use server'

import { sendTelegramNotification } from '@/services/notifications/telegram'
import { sendToCRM } from '@/services/notifications/crm'

export type ConsultationResult = { ok: boolean }

export type ConsultationInput = {
  name: string
  phone: string
}

export async function submitConsultationRequest(
  input: ConsultationInput,
): Promise<ConsultationResult> {
  const name = input?.name?.trim()
  const phone = input?.phone?.trim()

  if (!name || !phone) return { ok: false }
  if (name.length > 200 || phone.length > 50) return { ok: false }

  const submissionData = [
    { field: 'Имя', value: name },
    { field: 'Телефон', value: phone },
  ]

  const submission = { submissionData, form: { title: 'Заявка на консультацию' } }

  // Both services swallow their own errors; allSettled guards against unexpected throws
  await Promise.allSettled([sendTelegramNotification(submission), sendToCRM(submission)])

  return { ok: true }
}
