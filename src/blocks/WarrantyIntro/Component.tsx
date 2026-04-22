import { ShieldCheck } from 'lucide-react'

type Props = {
  heading?: string | null
  text?: string | null
  years?: string | null
}

export function WarrantyIntroBlockComponent({ heading, text, years }: Props) {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 max-w-2xl">
            {heading && (
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-8">{heading}</h2>
            )}
            {text && (
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                {text}
              </p>
            )}
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <div className="relative w-60 h-60">
              {/* outer decorative ring */}
              <svg
                viewBox="0 0 240 240"
                className="absolute inset-0 w-full h-full"
                fill="none"
              >
                <path
                  d="M120 12 C140 12, 165 25, 178 38 C191 51, 228 55, 228 75 C228 95, 220 115, 220 120 C220 125, 228 145, 228 165 C228 185, 205 195, 192 205 C179 215, 165 228, 145 228 C125 228, 115 220, 120 220 C125 220, 95 228, 75 228 C55 228, 41 215, 28 205 C15 195, 12 185, 12 165 C12 145, 20 125, 20 120 C20 115, 12 95, 12 75 C12 55, 49 51, 62 38 C75 25, 100 12, 120 12 Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-border"
                  strokeDasharray="6 4"
                />
                <path
                  d="M120 24 C138 24, 158 35, 170 47 C182 59, 216 63, 216 80 C216 97, 208 114, 208 120 C208 126, 216 143, 216 160 C216 177, 196 186, 184 195 C172 204, 160 216, 143 216 C126 216, 114 208, 120 208 C126 208, 94 216, 77 216 C60 216, 48 204, 36 195 C24 186, 24 177, 24 160 C24 143, 32 126, 32 120 C32 114, 24 97, 24 80 C24 63, 58 59, 70 47 C82 35, 102 24, 120 24 Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border/60"
                />
              </svg>

              {/* inner circle */}
              <div className="absolute inset-8 rounded-full bg-sidebar-accent flex flex-col items-center justify-center gap-1 shadow-inner">
                <ShieldCheck className="w-10 h-10 text-[var(--primary)]" />
                {years && (
                  <span className="text-3xl font-bold font-heading text-[var(--primary)] leading-none">
                    {years}
                  </span>
                )}
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  лет гарантии
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
