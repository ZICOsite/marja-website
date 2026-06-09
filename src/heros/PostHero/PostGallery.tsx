'use client'
import React, { useState, useEffect, useCallback } from 'react'
import NextImage from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'

export type GalleryImage = {
  url: string
  alt?: string | null
  width?: number | null
  height?: number | null
}

export const PostGallery: React.FC<{ images: GalleryImage[] }> = ({ images }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on('select', onSelect)
    api.on('reInit', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api, onSelect])

  if (!images.length) return null

  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
        <NextImage
          src={images[0].url}
          alt={images[0].alt ?? ''}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {images.map((img, i) => (
            <CarouselItem key={i}>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
                <NextImage
                  src={img.url}
                  alt={img.alt ?? ''}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="cursor-pointer left-2" />
        <CarouselNext className="cursor-pointer right-2" />
      </Carousel>

      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current
                ? 'w-6 h-2 bg-[var(--primary)]'
                : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
