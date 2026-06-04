import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { getLocale } from 'next-intl/server'

import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  locale?: string
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = async (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    locale: localeProp,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const locale = localeProp || await getLocale()

  const buildHref = () => {
    if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
      const prefix = `/${locale}`
      const collectionPrefix = reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''
      return `${prefix}${collectionPrefix}/${reference.value.slug}`
    }
    if (url && url.startsWith('/') && !url.startsWith(`/${locale}/`) && url !== `/${locale}`) {
      return `/${locale}${url}`
    }
    return url
  }

  const href = buildHref()

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
