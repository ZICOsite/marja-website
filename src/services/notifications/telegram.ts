import type { DeliveryStatus, FormSubmission } from './types'

export type { FormSubmission }

export async function sendTelegramNotification(
  submission: FormSubmission,
): Promise<DeliveryStatus> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) return 'skipped'

  const formTitle =
    typeof submission.form === 'object' && submission.form?.title
      ? submission.form.title
      : 'Новая заявка'

  const lines = submission.submissionData
    .filter(({ value }) => value !== undefined && value !== '')
    .map(({ field, value }) => `<b>${field}:</b> ${String(value)}`)
    .join('\n')

  const text = `📋 <b>${formTitle}</b>\n\n${lines}`

  // Сеть может отвалиться на любом шаге — исключение здесь означало бы, что
  // заявка останется в БД со статусом pending навсегда, поэтому ловим сами.
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    })

    if (!res.ok) {
      console.error('[Telegram] Failed to send message:', await res.text())
      return 'failed'
    }

    return 'sent'
  } catch (err) {
    console.error('[Telegram] Request error:', err)
    return 'failed'
  }
}
