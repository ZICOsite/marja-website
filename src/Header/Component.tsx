import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'
import { TopBar } from '@/ContactInfo/Component'

type Props = {
  locale: string
}

export async function Header({ locale }: Props) {
  const headerData: Header = await getCachedGlobal('header', 1, locale)()

  return (
    <>
      <TopBar locale={locale} />
      <HeaderClient data={headerData} locale={locale} />
    </>
  )
}
