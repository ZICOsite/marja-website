'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useCart } from '@/providers/Cart'

export const CartIcon: React.FC<{ locale: string }> = ({ locale }) => {
  const t = useTranslations('cart')
  const { totalCount, isReady } = useCart()

  return (
    <Link href={`/${locale}/cart`} className="relative" aria-label={t('title')}>
      <ShoppingCart className="w-5 text-primary" />
      {isReady && totalCount > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold leading-none tabular-nums">
          {totalCount > 99 ? '99+' : totalCount}
        </span>
      )}
    </Link>
  )
}
