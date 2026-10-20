import type { Metadata } from 'next'
import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { GeistMono } from 'geist/font/mono'
import { Inter } from 'next/font/google'

import { AdminBar } from '@/components/AdminBar'
import { GoogleAnalytics } from '@/components/Analytics/GoogleAnalytics'
import { PhoneClickTracker } from '@/components/Analytics/PhoneClickTracker'
import { YandexMetrika } from '@/components/Analytics/YandexMetrika'
import { FloatingContact } from '@/components/FloatingContact'
import { OrganizationJsonLd } from '@/components/OrganizationJsonLd'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { defaultTheme } from '@/providers/Theme/ThemeSelector/types'
import { routing, type Locale } from '@/i18n/routing'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { cn } from '@/utilities/ui'

import '../globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })

// <html lang> живёт здесь, а не в (frontend)/layout.tsx: раньше корневой layout брал
// локаль через getLocale(), а тот без params читает заголовки запроса. Это делало
// рендер динамическим (DYNAMIC_SERVER_USAGE), из-за чего на страницы ставили
// force-dynamic и сайт отдавал всё с Cache-Control: no-store — медленный LCP.
// Здесь локаль приходит из params, и страницы можно генерировать статически (ISR).

type Props = {
  children: React.ReactNode
  // Next.js calls this param "slug" because the folder is [slug],
  // but semantically it holds the locale value (uz, ru, en, tg, kk)
  params: Promise<{ slug: string }>
}

// Пустой список: на сборке ничего не пререндерим, страницы рендерятся при первом
// запросе и дальше живут в ISR-кэше. На проде сборка до Postgres не достаёт
// (порт закрыт), и пререндер /{loc}/products, /{loc}/cart ронял билд.
export function generateStaticParams() {
  return []
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
    <html
      className={cn(inter.variable, GeistMono.variable)}
      lang={locale}
      data-theme={defaultTheme}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <GoogleAnalytics />
        <YandexMetrika />
        <PhoneClickTracker />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <OrganizationJsonLd locale={locale} />
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
            <Header locale={locale} />
            <main>{children}</main>
            <Footer locale={locale} />
            <FloatingContact locale={locale} />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
  // Search Console — подтверждение мета-тегом. Файл public/googleccdb11f8c442cd82.html
  // подтверждает другой аккаунт, его не удалять.
  verification: {
    google: 'o9jRLgZNxn0W0dfjszPf1KB9VOj2DnIeY9GfCSoc_WI',
  },
}
