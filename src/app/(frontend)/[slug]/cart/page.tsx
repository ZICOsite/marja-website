import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'

import { CartView } from './CartView'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function CartPage({ params }: Args) {
  const { slug: locale } = await params
  setRequestLocale(locale)

  return <CartView locale={locale} />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug: locale } = await params
  const t = await getTranslations({ locale, namespace: 'cart' })
  return { title: t('title'), robots: { index: false, follow: false } }
}
