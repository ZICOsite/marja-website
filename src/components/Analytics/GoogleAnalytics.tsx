import Script from 'next/script'

import { ANALYTICS_HOST_CHECK, GA_ID } from '@/utilities/analyticsIds'

/**
 * Google Analytics 4 — gtag.js.
 * next/script `afterInteractive` bilan yuklanadi (sahifa tezligiga ta'sir qilmaydi).
 * Faqat ANALYTICS_HOSTS domenlarida ma'lumot yuboradi.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
// Не marja.uz (localhost, IP сервера) — GA4 ничего не отправляет (официальный opt-out gtag).
if (!(${ANALYTICS_HOST_CHECK})) { window['ga-disable-${GA_ID}'] = true; }
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  )
}
