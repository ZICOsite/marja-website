'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { useCart } from '@/providers/Cart'
import { OrderDialog } from '@/components/Product/OrderDialog'
import { getServerSideURL } from '@/utilities/getURL'
import { formatPrice } from '@/utilities/formatPrice'

export const CartView: React.FC<{ locale: string }> = ({ locale }) => {
  const t = useTranslations('cart')
  const { items, isReady, totalCount, removeItem, clear } = useCart()

  // Avoid a flash of "empty cart" before localStorage hydration
  if (!isReady) {
    return <div className="container mx-auto px-4 py-20 min-h-[40vh]" />
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[40vh]">
        <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold font-heading mb-2">{t('title')}</h1>
        <p className="text-muted-foreground mb-6">{t('empty')}</p>
        <Button asChild>
          <Link href={`/${locale}/products`}>{t('continueShopping')}</Link>
        </Button>
      </div>
    )
  }

  const baseUrl = getServerSideURL()
  const orderItems = items.map((i) => ({
    title: i.title,
    url: `${baseUrl}${i.href}`,
    sku: i.sku ?? null,
  }))

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-heading">
          {t('title')} <span className="text-muted-foreground text-xl">({totalCount})</span>
        </h1>
        <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5" onClick={clear}>
          <Trash2 className="w-4 h-4" /> {t('clear')}
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 items-center border border-border rounded-xl p-4 bg-background"
          >
            <Link
              href={item.href}
              className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-sidebar-accent"
            >
              {item.image ? (
                <Image src={item.image} alt={item.title} fill sizes="80px" className="object-contain" />
              ) : null}
            </Link>

            <div className="flex-1 min-w-0">
              <Link
                href={item.href}
                className="font-semibold hover:text-primary transition-colors line-clamp-2 font-sans"
              >
                {item.title}
              </Link>
              {(item.priceOnRequest || item.price != null) && (
                <p className="text-sm text-primary font-bold mt-1">
                  {item.priceOnRequest || item.price == null
                    ? t('priceOnRequest')
                    : `${formatPrice(item.price)} ${item.currency ?? 'UZS'}`}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label={t('remove')}
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-border pt-6">
        <Button asChild variant="outline">
          <Link href={`/${locale}/products`}>{t('continueShopping')}</Link>
        </Button>
        <OrderDialog
          items={orderItems}
          onSuccess={clear}
          trigger={
            <Button size="lg" className="gap-2">
              <ShoppingCart className="w-5 h-5" />
              {t('checkout')}
            </Button>
          }
        />
      </div>
    </div>
  )
}
