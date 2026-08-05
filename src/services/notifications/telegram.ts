import type { DeliveryStatus, FormSubmission } from './types'

export type { FormSubmission }

/**
 * Экранирует текст для `parse_mode: 'HTML'`.
 *
 * В заявку попадают имя, город и комментарий клиента. Без экранирования название
 * вроде «ООО <Марджа>» Telegram отвергает с 400 `can't parse entities`, заявка
 * остаётся в БД со статусом failed, а клиент уже увидел «Спасибо» — лид теряется
 * молча. Telegram требует экранировать только эти три символа.
 */
const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

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
    .map(({ field, value }) => `<b>${escapeHtml(field)}:</b> ${escapeHtml(String(value))}`)
    .join('\n')

  const text = `📋 <b>${escapeHtml(formTitle)}</b>\n\n${lines}`

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
