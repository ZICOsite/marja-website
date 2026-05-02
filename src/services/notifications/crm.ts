type SubmissionField = { field: string; value: string }

interface FormSubmission {
  submissionData: SubmissionField[]
  form?: { title?: string } | string
}

// Sends form submissions to a Make.com webhook, which forwards them to amoCRM.
// Set CRM_WEBHOOK_URL in .env to the webhook URL from your Make.com scenario.
export async function sendToCRM(submission: FormSubmission): Promise<void> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL
  if (!webhookUrl) return

  const fields = Object.fromEntries(
    submission.submissionData.map(({ field, value }) => [field, value]),
  )

  const formName =
    typeof submission.form === 'object' ? (submission.form?.title ?? '') : (submission.form ?? '')

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: 'marja-website', form: formName, ...fields }),
  })

  if (!res.ok) {
    console.error('[CRM] Webhook failed:', await res.text())
  }
}
