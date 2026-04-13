import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateProject: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const locales = payload.config.localization
      ? payload.config.localization.locales.map((l) => (typeof l === 'string' ? l : l.code))
      : ['uz']

    for (const locale of locales) {
      revalidatePath(`/${locale}/projects`)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const locales = payload.config.localization
      ? payload.config.localization.locales.map((l) => (typeof l === 'string' ? l : l.code))
      : ['uz']

    for (const locale of locales) {
      revalidatePath(`/${locale}/projects`)
    }
  }
  return doc
}
