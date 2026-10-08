'use client'

import { useEffect } from 'react'

import { trackLead } from '@/utilities/trackLead'

/**
 * `tel:` havolalariga bosishni kuzatadi.
 *
 * Telefon havolalari sayt bo'ylab server komponentlarida tarqalgan (yuqori panel,
 * futer, "Kontaktlar" bloki, suzuvchi tugma) — har biriga alohida `onClick` qo'yish
 * uchun ularni client komponentga aylantirish kerak bo'lardi. Shuning uchun bitta
 * delegatsiyalangan listener ishlatiladi: u hozirgi va kelajakdagi barcha
 * `tel:` havolalarini qamrab oladi.
 */
export function PhoneClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target
      if (!(target instanceof Element)) return

      const link = target.closest('a[href^="tel:"]')
      if (!link) return

      trackLead('phone_click')
    }

    // Capture — havola `preventDefault` qilinsa yoki React handler'i hodisani
    // to'xtatsa ham hisoblanadi.
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
