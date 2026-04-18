import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

import { locales } from '@/i18n/routing'

export const revalidateProductsNotice: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating products-notice`)
    for (const locale of locales) {
      revalidateTag(`global_products-notice_${locale}`)
    }
  }

  return doc
}
