type SubmissionField = { field: string; value: string }

interface FormSubmission {
  submissionData: SubmissionField[]
  form?: { title?: string } | string
}

export async function sendTelegramNotification(submission: FormSubmission): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) return

  const formTitle =
    typeof submission.form === 'object' && submission.form?.title
      ? submission.form.title
      : 'Новая заявка'

  const lines = submission.submissionData
    .filter(({ value }) => value !== undefined && value !== '')
    .map(({ field, value }) => `<b>${field}:</b> ${String(value)}`)
    .join('\n')

  const text = `📋 <b>${formTitle}</b>\n\n${lines}`

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })

  if (!res.ok) {
    console.error('[Telegram] Failed to send message:', await res.text())
  }
}
