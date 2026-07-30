import { headers } from 'next/headers'

/**
 * IP клиента из заголовков, которые проставляет nginx
 * (см. nginx/conf.d/marja.conf: X-Real-IP и X-Forwarded-For).
 * Возвращает 'unknown', если заголовков нет — например, в локальной разработке.
 */
export async function getClientIp(): Promise<string> {
  try {
    const list = await headers()

    const forwarded = list.get('x-forwarded-for')
    // X-Forwarded-For — цепочка «клиент, прокси1, прокси2»: клиент первый
    if (forwarded) {
      const first = forwarded.split(',')[0]?.trim()
      if (first) return first
    }

    return list.get('x-real-ip')?.trim() || 'unknown'
  } catch {
    return 'unknown'
  }
}
