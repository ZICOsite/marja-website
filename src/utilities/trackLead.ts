import { YM_ID } from './analyticsIds'

/**
 * Lead (konversiya) hodisasini GA4 va Yandex Metrika'ga yuborish.
 *
 * Har bir muvaffaqiyatli lead harakatida (forma, konsultatsiya, mahsulot buyurtmasi,
 * qo'ng'iroq/telegram bosish) `generate_lead` GA4 hodisasi yuboriladi.
 * Bu hodisa GA4'da "key event" sifatida belgilanib, Google Ads'ga konversiya
 * sifatida import qilinadi (GA4 ↔ Google Ads bog'lanishi orqali).
 *
 * Metrika'ga esa shu nomdagi maqsad (`reachGoal`) yuboriladi — maqsad
 * Metrika interfeysida `generate_lead` identifikatori bilan yaratilgan bo'lishi kerak.
 *
 * Hisoblagichlar hali yuklanmagan bo'lsa (yoki reklama blok qilgan bo'lsa) —
 * har biri alohida, jimgina o'tkazib yuboriladi.
 */
export type LeadSource =
  | 'contact_form'
  | 'consultation'
  | 'product_order'
  | 'phone_click'
  | 'telegram_click'
  | 'calculator'

type Gtag = (command: string, eventName: string, params?: Record<string, unknown>) => void

const GOAL = 'generate_lead'

export function trackLead(source: LeadSource, extra?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return

  const params = { lead_source: source, ...extra }

  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  if (typeof gtag === 'function') {
    gtag('event', GOAL, params)
  }

  // Metrika: uchinchi argument — maqsad identifikatori, to'rtinchisi — parametrlari.
  window.ym?.(YM_ID, 'reachGoal', GOAL, params)
}
