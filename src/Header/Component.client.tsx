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
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="sticky top-0 z-20 py-2 bg-[var(--background)] shadow-md" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="container flex justify-between">
        <Link href={`/${locale}`} aria-label={t('home')}>
          <Logo className="logo" />
        </Link>
        <HeaderNav data={data} locale={locale} categories={categories} />
      </div>
    </header>
  )
}
