import Script from 'next/script'

import { ANALYTICS_HOST_CHECK, YM_ID } from '@/utilities/analyticsIds'

import { YandexMetrikaPageviews } from './YandexMetrikaPageviews'

/**
 * Yandex Metrika — tag.js.
 * next/script `afterInteractive` bilan yuklanadi (sahifa tezligiga ta'sir qilmaydi).
 */
export function YandexMetrika() {
  if (!YM_ID) return null

  return (
    <>
      <Script id="ym-init" strategy="afterInteractive">
        {`// Не marja.uz (localhost, IP сервера) — Метрику не загружаем: window.ym не появится,
// и trackLead / YandexMetrikaPageviews молча пропустят вызовы.
if (${ANALYTICS_HOST_CHECK}) {
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

ym(${YM_ID}, 'init', {
  webvisor: true,
  clickmap: true,
  referrer: document.referrer,
  url: location.href,
  accurateTrackBounce: true,
  trackLinks: true
});
}`}
      </Script>
      <YandexMetrikaPageviews ymId={YM_ID} />
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${YM_ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
