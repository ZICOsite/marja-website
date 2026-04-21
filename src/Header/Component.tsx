import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, ProductCategory } from '@/payload-types'
import { TopBar } from '@/ContactInfo/Component'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type Props = {
  locale: string
}

const getHeaderCategories = (locale: string) =>
  unstable_cache(
    async (): Promise<ProductCategory[]> => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'product-categories',
        limit: 12,
        pagination: false,
        overrideAccess: false,
        locale: locale as any,
        fallbackLocale: false,
        where: {
          and: [{ parent: { exists: false } }, { _status: { equals: 'published' } }],
        },
        depth: 0,
        select: { title: true, slug: true },
      })
      return (result.docs as ProductCategory[]).filter((cat) => cat.title)
    },
    [`header-categories-${locale}`],
    { tags: [`global_header_${locale}`, 'product-categories'] },
  )

export async function Header({ locale }: Props) {
  const headerData: Header = await getCachedGlobal('header', 1, locale)()
  const categories = await getHeaderCategories(locale)()

  return (
    <>
      <TopBar locale={locale} />
      <HeaderClient data={headerData} locale={locale} categories={categories} />
    </>
  )
}
