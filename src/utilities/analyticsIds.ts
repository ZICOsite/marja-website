/**
 * Analitika hisoblagichlari ID'si.
 *
 * Bitta joyda saqlanadi, chunki ularni ham skript'larni ulaydigan komponentlar,
 * ham hodisa yuboradigan `trackLead` ishlatadi.
 * Env orqali override qilinishi mumkin, aks holda fallback.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-45X0FRFYW1'
export const YM_ID = process.env.NEXT_PUBLIC_YM_ID || '99615040'

declare global {
  interface Window {
    ym?: (id: number | string, action: string, ...args: unknown[]) => void
  }
}
