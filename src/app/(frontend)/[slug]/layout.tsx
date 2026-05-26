import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { routing, type Locale } from '@/i18n/routing'

type Props = {
  children: React.ReactNode
  // Next.js calls this param "slug" because the folder is [slug],
  // but semantically it holds the locale value (uz, ru, en, tg, kk)
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ slug: locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { slug: locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()
  const { isEnabled } = await draftMode()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <AdminBar
          adminBarProps={{
            preview: isEnabled,
          }}
        />
        <Header locale={locale} />
        {children}
        <Footer locale={locale} />
      </Providers>
    </NextIntlClientProvider>
  )
}
