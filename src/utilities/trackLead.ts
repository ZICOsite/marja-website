/**
 * GA4 lead (konversiya) hodisasini yuborish.
 *
 * Har bir muvaffaqiyatli lead harakatida (forma, konsultatsiya, mahsulot buyurtmasi,
 * qo'ng'iroq/telegram bosish) `generate_lead` GA4 hodisasi yuboriladi.
 * Bu hodisa GA4'da "key event" sifatida belgilanib, Google Ads'ga konversiya
 * sifatida import qilinadi (GA4 ↔ Google Ads bog'lanishi orqali).
 *
 * gtag hali yuklanmagan bo'lsa (yoki reklama blok qilgan bo'lsa) — jimgina qaytadi.
 */
export type LeadSource =
  | 'contact_form'
  | 'consultation'
  | 'product_order'
  | 'phone_click'
  | 'telegram_click'

type Gtag = (command: string, eventName: string, params?: Record<string, unknown>) => void

export function trackLead(source: LeadSource, extra?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  if (typeof gtag !== 'function') return

  gtag('event', 'generate_lead', {
    lead_source: source,
    ...extra,
  })
}
