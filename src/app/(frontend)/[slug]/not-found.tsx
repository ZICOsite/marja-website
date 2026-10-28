import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import React from 'react'

import { BrandGraphic } from '@/components/BrandGraphic'
import { Button } from '@/components/ui/button'

export default async function NotFound() {
  const t = await getTranslations('errors')

  return (
    <div className="container relative py-28">
      <BrandGraphic
        variant="m"
        className="right-0 top-1/2 h-[80%] -translate-y-1/2 text-marja-navy/6"
      />
      <div className="prose max-w-none relative">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">{t('notFoundDescription')}</p>
      </div>
      <Button asChild variant="default" className="relative">
        <Link href="/">{t('goHome')}</Link>
      </Button>
    </div>
  )
}
