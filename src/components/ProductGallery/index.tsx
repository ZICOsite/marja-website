'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { cn } from '@/utilities/ui'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type GalleryImage = {
  url: string
  alt?: string | null
}

type Props = {
  images: GalleryImage[]
}

export const ProductGallery: React.FC<Props> = ({ images }) => {
  const t = useTranslations('products.gallery')
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }, [])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on('select', onSelect)
    return () => { api.off('select', onSelect) }
  }, [api, onSelect])

  if (images.length === 0) return null

  const hasSingle = images.length === 1

  return (
    <div className="flex flex-col gap-4">
      {/* Main carousel */}
      <Carousel setApi={setApi} opts={{ loop: images.length > 1 }} className="w-full">
        <CarouselContent className="-ml-0">
          {images.map((img, i) => (
            <CarouselItem key={i} className="pl-0">
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-sidebar-accent">
                <Image
                  src={img.url}
                  alt={img.alt ?? ''}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrow controls */}
        {!hasSingle && (
          <>
            <button
              onClick={() => api?.scrollPrev()}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-background transition-colors cursor-pointer"
              aria-label={t('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-background transition-colors cursor-pointer"
              aria-label={t('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    'rounded-full transition-all duration-200 cursor-pointer',
                    current === i
                      ? 'w-5 h-1.5 bg-primary'
                      : 'w-1.5 h-1.5 bg-background/70 hover:bg-background',
                  )}
                  aria-label={t('photo', { index: i + 1 })}
                />
              ))}
            </div>
          </>
        )}
      </Carousel>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                'relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-150 cursor-pointer',
                current === i
                  ? 'border-primary shadow-sm'
                  : 'border-transparent opacity-60 hover:opacity-100',
              )}
              aria-label={t('photo', { index: i + 1 })}
            >
              <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
