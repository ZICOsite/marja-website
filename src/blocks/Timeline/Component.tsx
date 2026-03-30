import React from 'react'
import type { TimelineBlock as TimelineBlockProps } from '@/payload-types'
import { Star } from 'lucide-react'

type Props = TimelineBlockProps

export const TimelineBlockComponent: React.FC<Props> = ({ heading, items }) => {
  if (!items?.length) return null

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-16">
            {heading}
          </h2>
        )}

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />

          <div className="flex flex-col gap-12 md:gap-0">
            {items.map((item, index) => {
              const isEven = index % 2 === 0

              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row md:items-center gap-6 md:gap-0 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content card */}
                  <div className={`md:w-[calc(50%-2.5rem)] ${isEven ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'}`}>
                    <div className="group relative bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300">
                      {/* Year badge */}
                      <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                        {item.year}
                      </span>
                      <h3 className="text-lg font-semibold font-heading mb-2 text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>

                      {/* Connector arrow */}
                      <div
                        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent ${
                          isEven
                            ? 'right-[-8px] border-l-8 border-l-border'
                            : 'left-[-8px] border-r-8 border-r-border'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/30">
                    <Star className="w-5 h-5 text-primary-foreground" />
                  </div>

                  {/* Mobile year label */}
                  <div className="md:hidden flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                      <Star className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-primary font-bold text-sm uppercase tracking-widest">{item.year}</span>
                  </div>

                  {/* Empty opposite side */}
                  <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
