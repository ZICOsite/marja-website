'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import type { Header, ProductCategory } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  locale: string
  categories: ProductCategory[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, locale, categories }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const t = useTranslations('common')
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    // Брендбук п. 4: белая шапка с границей 1 px grey вместо тени. py-3.5 = охранное поле логотипа 14 px.
    <header className="sticky top-0 z-20 py-3.5 bg-[var(--background)] border-b border-marja-grey" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="container flex items-center justify-between gap-3.5">
        <Link href={`/${locale}`} aria-label={`MARJA — ${t('home')}`} className="shrink-0">
          <Logo className="logo w-[120px] lg:w-[180px]" />
        </Link>
        <HeaderNav data={data} locale={locale} categories={categories} />
      </div>
    </header>
  )
}
