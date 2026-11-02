/**
 * Analitika hisoblagichlari ID'si.
 *
 * Bitta joyda saqlanadi, chunki ularni ham skript'larni ulaydigan komponentlar,
 * ham hodisa yuboradigan `trackLead` ishlatadi.
 * Env orqali override qilinishi mumkin, aks holda fallback.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-B5NYXG2EXM'
export const YM_ID = process.env.NEXT_PUBLIC_YM_ID || '99615040'

/**
 * Hisoblagichlar faqat shu domenlarda ishlaydi (localhost, server IP'si va h.k. —
 * statistikani buzmasligi uchun). Env orqali vergul bilan override qilinadi.
 * Счётчики работают только на этих доменах: localhost и заходы по IP не портят статистику.
 */
export const ANALYTICS_HOSTS = (process.env.NEXT_PUBLIC_ANALYTICS_HOSTS || 'marja.uz,www.marja.uz')
  .split(',')
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean)

/** Inline-skriptlar uchun: joriy domen ruxsat etilganmi (JS ifoda sifatida). */
export const ANALYTICS_HOST_CHECK = `${JSON.stringify(ANALYTICS_HOSTS)}.indexOf(location.hostname.toLowerCase()) !== -1`

declare global {
  interface Window {
    ym?: (id: number | string, action: string, ...args: unknown[]) => void
  }
}
