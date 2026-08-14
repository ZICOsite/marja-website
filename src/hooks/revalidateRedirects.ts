import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateRedirects: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  // `revalidateTag` живёт только внутри запроса Next. При записи из скрипта
  // (Local API в контейнере migrate) он бросает «Invariant: static generation
  // store missing» и роняет саму операцию записи. Остальные шесть revalidate-
  // хуков проекта закрыты этим же флагом — здесь его просто забыли.
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating redirects`)

    revalidateTag('redirects')
  }

  return doc
}
