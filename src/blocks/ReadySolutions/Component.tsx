'use client'

import Image from 'next/image'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { cn } from '@/utilities/ui'

type MediaImage = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

type Section = {
  id?: string | null
  title: string
  content?: string | null
}

type Tab = {
  id?: string | null
  label: string
  schemeImage?: MediaImage | string | number | null
  sections?: Section[] | null
}

type Props = {
  title: string
  description?: string | null
  tabs?: Tab[] | null
}

export function ReadySolutionsBlockComponent({ title, description, tabs }: Props) {
  const validTabs = (tabs ?? []).filter((t): t is Tab => typeof t === 'object' && t !== null)

  if (validTabs.length === 0) return null

  return (
    <section className='pb-16'>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">{title}</h2>
          {description && (
            <p className="text-muted-foreground text-base leading-relaxed">{description}</p>
          )}
        </div>

        <Tabs defaultValue="0">
          {validTabs.length > 1 && (
            <TabsList className="flex w-fit mx-auto mb-10 h-auto gap-2 bg-transparent p-0">
              {validTabs.map((t, i) => (
                <TabsTrigger
                  key={i}
                  value={String(i)}
                  className="px-6 py-2 rounded-full text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md bg-muted text-muted-foreground cursor-pointer"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          )}

          {validTabs.map((tab, i) => {
            const image =
              typeof tab.schemeImage === 'object' && tab.schemeImage !== null
                ? (tab.schemeImage as MediaImage)
                : null
            const sections = (tab.sections ?? []).filter(
              (s): s is Section => typeof s === 'object' && s !== null,
            )

            return (
              <TabsContent key={i} value={String(i)} className="mt-0">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {image?.url ? (
                    <div className="w-full lg:w-1/2 shrink-0 rounded-2xl overflow-hidden border border-border bg-muted/30">
                      <Image
                        src={image.url}
                        alt={image.alt || title}
                        width={image.width || 800}
                        height={image.height || 600}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full lg:w-1/2 shrink-0 rounded-2xl border border-border bg-muted/30 h-64 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Схема не загружена</span>
                    </div>
                  )}

                  <div className={cn('w-full lg:w-1/2', sections.length === 0 && 'hidden')}>
                    <Accordion type="single" collapsible defaultValue="0">
                      {sections.map((section, j) => (
                        <AccordionItem
                          key={j}
                          value={String(j)}
                          className="border border-border rounded-xl mb-3 px-5 last:mb-0 data-[state=open]:border-primary/40 data-[state=open]:bg-primary/5 transition-colors"
                        >
                          <AccordionTrigger className="font-semibold text-base hover:no-underline data-[state=open]:text-primary py-4 cursor-pointer">
                            {section.title}
                          </AccordionTrigger>
                          {section.content && (
                            <AccordionContent>
                              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {section.content}
                              </p>
                            </AccordionContent>
                          )}
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}
