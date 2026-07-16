'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import type { Product } from '@/payload-types'

type Props = {
  products: Product[]
  locale: string
}

export function RelatedProductsSlider({ products, locale }: Props) {
  const t = useTranslations('products')

  return (
    <Carousel opts={{ align: 'start', loop: false }} className="w-full">
      <CarouselContent className="-ml-4">
        {products.map((related) => {
          const img =
            typeof related.heroImage === 'object' && related.heroImage !== null
              ? (related.heroImage as { url?: string | null; alt?: string | null })
              : null
          return (
            <CarouselItem
              key={related.id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Link
                href={`/${locale}/products/${related.slug}`}
                className="group rounded-xl overflow-hidden border border-border hover:border-primary transition-colors flex flex-col h-full"
              >
                {img?.url ? (
                  <div className="relative h-40 overflow-hidden shrink-0">
                    <Image
                      src={img.url}
                      alt={img.alt ?? ''}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-sidebar-accent shrink-0" />
                )}
                <div className="p-4">
                  <h3 className="font-sans font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  {related.sku && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('sku')}: <span className="font-mono">{related.sku}</span>
                    </p>
                  )}
                </div>
              </Link>
            </CarouselItem>
          )
        })}
      </CarouselContent>

      <CarouselPrevious className="-left-5 hidden sm:flex" />
      <CarouselNext className="-right-5 hidden sm:flex" />
    </Carousel>
  )
}
