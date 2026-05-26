'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { cn } from '@/utilities/ui'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

type GalleryImage = {
  url: string
  alt?: string | null
}

type Props = {
  images: GalleryImage[]
}

export const ProductGallery: React.FC<Props> = ({ images }) => {
  const t = useTranslations('products.gallery')

  // Main carousel
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect(api) // Embla: sync state immediately on mount/reinit
    api.on('select', onSelect)
    return () => { api.off('select', onSelect) }
  }, [api, onSelect])

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxApi, setLightboxApi] = useState<CarouselApi>()
  const [lightboxCurrent, setLightboxCurrent] = useState(0)

  const onLightboxSelect = useCallback((api: CarouselApi) => {
    if (!api) return
    setLightboxCurrent(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!lightboxApi) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onLightboxSelect(lightboxApi) // Embla: sync state immediately on mount/reinit
    lightboxApi.on('select', onLightboxSelect)
    return () => { lightboxApi.off('select', onLightboxSelect) }
  }, [lightboxApi, onLightboxSelect])

  // Sync lightbox to clicked index when it opens
  useEffect(() => {
    if (lightboxOpen && lightboxApi) {
      lightboxApi.scrollTo(lightboxIndex, false)
    }
  }, [lightboxOpen, lightboxApi, lightboxIndex])

  function openLightbox(index: number) {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  if (images.length === 0) {
    return (
      <div className="w-full rounded-2xl aspect-square bg-sidebar-accent flex items-center justify-center">
        <span className="text-muted-foreground text-sm">No image</span>
      </div>
    )
  }

  const hasSingle = images.length === 1

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main carousel */}
        <Carousel setApi={setApi} opts={{ loop: images.length > 1 }} className="w-full">
          <CarouselContent className="-ml-0">
            {images.map((img, i) => (
              <CarouselItem key={i} className="pl-0">
                <button
                  type="button"
                  onClick={() => openLightbox(i)}
                  className="group relative w-full rounded-2xl overflow-hidden aspect-square bg-sidebar-accent block cursor-zoom-in"
                  aria-label={t('photo', { index: i + 1 })}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? ''}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 drop-shadow-md" />
                  </div>
                </button>
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
                <Image src={img.url} alt={img.alt ?? ''} fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-5xl w-full p-0 bg-gray-500 border-0 overflow-hidden [&>button]:text-white [&>button]:bg-black/40 [&>button]:rounded-full [&>button]:p-1 [&>button]:top-3 [&>button]:right-3">
          <DialogTitle className="sr-only">{t('photo', { index: lightboxCurrent + 1 })}</DialogTitle>
          <Carousel
            setApi={setLightboxApi}
            opts={{ loop: images.length > 1, startIndex: lightboxIndex }}
            className="w-full"
          >
            <CarouselContent className="-ml-0">
              {images.map((img, i) => (
                <CarouselItem key={i} className="pl-0">
                  <div className="relative w-full" style={{ height: '80vh' }}>
                    <Image
                      src={img.url}
                      alt={img.alt ?? ''}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      priority={i === lightboxIndex}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {!hasSingle && (
              <>
                <button
                  onClick={() => lightboxApi?.scrollPrev()}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors cursor-pointer"
                  aria-label={t('prev')}
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => lightboxApi?.scrollNext()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors cursor-pointer"
                  aria-label={t('next')}
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </Carousel>

          {/* Counter */}
          {!hasSingle && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
              {lightboxCurrent + 1} / {images.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
