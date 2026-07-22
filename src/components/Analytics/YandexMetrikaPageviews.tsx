'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

declare global {
  interface Window {
    ym?: (id: number | string, action: string, ...args: unknown[]) => void
  }
}

/**
 * Next.js App Router'da sahifalar client tomonda almashadi — brauzer qayta yuklanmaydi,
 * shuning uchun Metrika faqat birinchi kirishni hisoblaydi. Bu komponent har navigatsiyada
 * `ym('hit')` yuboradi (birinchi render init'da hisoblangani uchun o'tkazib yuboriladi).
 */
function Tracker({ ymId }: { ymId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const query = searchParams?.toString()
    const url = pathname + (query ? `?${query}` : '')

    window.ym?.(ymId, 'hit', url, { referer: document.referrer })
  }, [pathname, searchParams, ymId])

  return null
}

export function YandexMetrikaPageviews({ ymId }: { ymId: string }) {
  return (
    <Suspense fallback={null}>
      <Tracker ymId={ymId} />
    </Suspense>
  )
}
