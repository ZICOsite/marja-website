'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Project = {
  id: number
  title: string
  description?: string | null
  gallery?: (number | Media)[] | null
}

type Props = {
  project: Project
}

export const ProjectCard: React.FC<Props> = ({ project }) => {
  const t = useTranslations('products.gallery')

  const images = (project.gallery ?? [])
    .flatMap((item) => {
      if (typeof item !== 'object' || item === null) return []
      const media = item as Media
      if (!media.url) return []
      return [{ url: media.url, alt: media.alt }]
    })

  // Main carousel (только для свайпа без навигации)
  const [, setApi] = useState<CarouselApi>()

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxApi, setLightboxApi] = useState<CarouselApi>()
  const [lightboxCurrent, setLightboxCurrent] = useState(0)
  const onLightboxSelect = useCallback((a: CarouselApi) => {
    if (!a) return
    setLightboxCurrent(a.selectedScrollSnap())
  }, [])
  useEffect(() => {
    if (!lightboxApi) return
    onLightboxSelect(lightboxApi)
    lightboxApi.on('select', onLightboxSelect)
    return () => { lightboxApi.off('select', onLightboxSelect) }
  }, [lightboxApi, onLightboxSelect])
  useEffect(() => {
    if (lightboxOpen && lightboxApi) {
      lightboxApi.scrollTo(lightboxIndex, false)
    }
  }, [lightboxOpen, lightboxApi, lightboxIndex])

  const hasSingle = images.length === 1

  return (
    <>
      <div className="group relative rounded-2xl overflow-hidden border border-border hover:border-[var(--primary)] transition-colors bg-background cursor-zoom-in">
        {/* Слайдер */}
        {images.length === 0 ? (
          <div className="h-64 bg-sidebar-accent flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        ) : (
          <Carousel setApi={setApi} opts={{ loop: images.length > 1 }} className="w-full">
            <CarouselContent className="-ml-0">
              {images.map((img, i) => (
                <CarouselItem key={i} className="pl-0">
                  <div
                    className="relative h-64 overflow-hidden bg-sidebar-accent"
                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={i === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        {/* Hover-оверлей с заголовком и описанием */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h2 className="font-sans font-bold text-white text-base leading-snug">
            {project.title}
          </h2>
          {project.description && (
            <p className="text-sm text-white/80 mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Лайтбокс */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-5xl w-full p-0 bg-gray-900 border-0 overflow-hidden [&>button]:text-white [&>button]:bg-black/40 [&>button]:rounded-full [&>button]:p-1 [&>button]:top-3 [&>button]:right-3"
        >
          <DialogTitle className="sr-only">{project.title}</DialogTitle>
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
