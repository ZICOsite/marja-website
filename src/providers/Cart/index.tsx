'use client'

import React, { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  id: string
  title: string
  href: string
  image?: string | null
  price?: number | null
  currency?: string | null
  priceOnRequest?: boolean | null
  sku?: string | null
}

type CartContextType = {
  items: CartItem[]
  /** True once the cart has been hydrated from localStorage (client only). */
  isReady: boolean
  /** Number of distinct products in the cart. */
  totalCount: number
  has: (id: string) => boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  toggleItem: (item: CartItem) => void
  clear: () => void
}

const CART_STORAGE_KEY = 'marja-cart'

const noop = () => {}

const initialContext: CartContextType = {
  items: [],
  isReady: false,
  totalCount: 0,
  has: () => false,
  addItem: noop,
  removeItem: noop,
  toggleItem: noop,
  clear: noop,
}

const CartContext = createContext<CartContextType>(initialContext)

function isValidItem(value: unknown): value is CartItem {
  return !!value && typeof value === 'object' && typeof (value as CartItem).id === 'string'
}

function readStoredCart(raw: string | null): CartItem[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isValidItem) : []
  } catch {
    return []
  }
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isReady, setIsReady] = useState(false)

  // Hydrate from localStorage once on mount
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setItems(readStoredCart(window.localStorage.getItem(CART_STORAGE_KEY)))
    setIsReady(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  // Persist on change (only after hydration, so we never clobber stored data)
  useEffect(() => {
    if (!isReady) return
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore quota / private-mode write errors
    }
  }, [items, isReady])

  // Keep the cart in sync across browser tabs
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return
      setItems(readStoredCart(event.newValue))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const toggleItem = useCallback((item: CartItem) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item],
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items])

  const value = useMemo<CartContextType>(
    () => ({
      items,
      isReady,
      totalCount: items.length,
      has,
      addItem,
      removeItem,
      toggleItem,
      clear,
    }),
    [items, isReady, has, addItem, removeItem, toggleItem, clear],
  )

  return <CartContext value={value}>{children}</CartContext>
}

export const useCart = (): CartContextType => use(CartContext)
