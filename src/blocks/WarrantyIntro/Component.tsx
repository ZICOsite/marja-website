'use client'

import { ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Props = {
  heading?: string | null
  text?: string | null
  years?: string | null
}

export function WarrantyIntroBlockComponent({ heading, text, years }: Props) {
  const t = useTranslations('warranty')

  return (
    <section className="py-24 relative overflow-hidden">

      <div className="container relative">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* Text */}
          <div className="flex-1 max-w-2xl">
            {heading && (
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-8 leading-tight">
                {heading}
              </h2>
            )}
            {text && (
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line text-justify">
                {text}
              </p>
            )}
          </div>

          {/* Badge */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="relative w-72 h-72">

              {/* Outer dashed ring — slow clockwise */}
              <svg
                viewBox="0 0 288 288"
                className="absolute inset-0 w-full h-full animate-spin [animation-duration:30s]"
                fill="none"
              >
                <circle
                  cx="144"
                  cy="144"
                  r="140"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-primary/40"
                  strokeDasharray="10 6"
                />
              </svg>

              {/* Middle dashed ring — counter-clockwise */}
              <svg
                viewBox="0 0 288 288"
                className="absolute inset-0 w-full h-full animate-spin [animation-duration:20s] [animation-direction:reverse]"
                fill="none"
              >
                <circle
                  cx="144"
                  cy="144"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-primary/25"
                  strokeDasharray="5 8"
                />
              </svg>

              {/* Static inner ring */}
              <div className="absolute inset-10 rounded-full border border-primary/15" />

              {/* Filled core */}
              <div className="absolute inset-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex flex-col items-center justify-center gap-0.5 shadow-xl">
                <ShieldCheck className="w-9 h-9 text-primary" strokeWidth={1.5} />
                {years && (
                  <span className="text-[2rem] font-bold font-heading text-primary leading-none">
                    {years}
                  </span>
                )}
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.14em] text-center px-1 leading-tight">
                  {t('yearsLabel')}
                </span>
              </div>

              {/* Cardinal accent dots */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/60" />
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/60" />
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/60" />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/60" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
