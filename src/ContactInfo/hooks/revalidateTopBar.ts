import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateContactInfo: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating contact-info`)

    revalidateTag('global_contact-info_uz')
    revalidateTag('global_contact-info_ru')
    revalidateTag('global_contact-info_en')
    revalidateTag('global_contact-info_tg')
    revalidateTag('global_contact-info_kk')
  }

  return doc
}
