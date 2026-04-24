type SubmissionField = { field: string; value: string }

interface FormSubmission {
  submissionData: SubmissionField[]
  form?: { title?: string } | string
}

// TODO: Replace with real CRM endpoint and payload structure once CRM credentials are available.
// Set CRM_API_URL and CRM_API_KEY in .env to activate.
export async function sendToCRM(submission: FormSubmission): Promise<void> {
  const apiUrl = process.env.CRM_API_URL
  const apiKey = process.env.CRM_API_KEY

  if (!apiUrl || !apiKey) return

  const fields = Object.fromEntries(
    submission.submissionData.map(({ field, value }) => [field, value]),
  )

  const formName =
    typeof submission.form === 'object' ? (submission.form?.title ?? '') : (submission.form ?? '')

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ source: 'marja-website', form: formName, fields }),
  })

  if (!res.ok) {
    console.error('[CRM] Failed to send submission:', await res.text())
  }
}
