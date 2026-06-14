'use client'

import React from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { useCart, type CartItem } from '@/providers/Cart'

type Props = {
  product: CartItem
}

export const AddToCartButton: React.FC<Props> = ({ product }) => {
  const t = useTranslations('cart')
  const { has, toggleItem, isReady } = useCart()
  const inCart = has(product.id)

  return (
    <Button
      variant="outline"
      size="lg"
      className="gap-2"
      disabled={!isReady}
      aria-pressed={inCart}
      onClick={() => toggleItem(product)}
    >
      {inCart ? <Check className="w-5 h-5 text-green-600" /> : <ShoppingCart className="w-5 h-5" />}
      {inCart ? t('inCart') : t('addToCart')}
    </Button>
  )
}
