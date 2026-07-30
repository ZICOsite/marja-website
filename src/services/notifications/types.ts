export type SubmissionField = { field: string; value: string }

export interface FormSubmission {
  submissionData: SubmissionField[]
  form?: { title?: string } | string
}

/**
 * Чем закончилась попытка доставки в один канал.
 *
 * `skipped` — канал не настроен (нет токена/URL), это конфигурация, а не сбой:
 * отличать его от `failed` нужно, чтобы в админке «не доставлено» означало
 * настоящую проблему, а не забытую переменную окружения на стенде.
 */
export type DeliveryStatus = 'sent' | 'failed' | 'skipped'
