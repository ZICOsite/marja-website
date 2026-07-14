import Script from 'next/script'

// GA4 Measurement ID. Env orqali override qilinishi mumkin, aks holda fallback.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-45X0FRFYW1'

/**
 * Google Analytics 4 — gtag.js.
 * next/script `afterInteractive` bilan yuklanadi (sahifa tezligiga ta'sir qilmaydi).
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
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  )
}
