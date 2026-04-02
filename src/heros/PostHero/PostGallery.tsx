'use client'
import React from 'react'
import NextImage from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export type GalleryImage = {
  url: string
  alt?: string | null
  width?: number | null
  height?: number | null
}

export const PostGallery: React.FC<{ images: GalleryImage[] }> = ({ images }) => {
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
      <Carousel>
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
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      <div className="flex justify-center gap-1.5 mt-3">
        {images.map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
        ))}
      </div>
    </div>
  )
}
