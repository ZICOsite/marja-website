import { ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

type Point = {
  id?: string | null
  text: string
}

type Props = {
  label?: string | null
  heading?: string | null
  description?: string | null
  image?: MediaType | string | number | null
  points?: Point[] | null
}

export function LeanIntroBlockComponent({ label, heading, description, image, points }: Props) {
  const hasImage = image && typeof image === 'object'
  const validPoints = (points ?? []).filter((p): p is Point => !!p.text)

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="flex-1">
            {label && (
              <span className="inline-block text-[var(--primary)] font-bold uppercase tracking-widest text-sm mb-4">
                {label}
              </span>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6 leading-tight text-balance">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 whitespace-pre-line">
                {description}
              </p>
            )}
            {validPoints.length > 0 && (
              <ul className="space-y-3">
                {validPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--primary)]" />
                    </span>
                    <span className="text-foreground/80 leading-relaxed">{point.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {hasImage && (
            <div className="w-full lg:w-5/12 shrink-0 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Media
                  resource={image}
                  className="absolute inset-0 w-full h-full"
                  imgClassName="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              </div>
              <div
                className="absolute -bottom-4 -right-4 w-28 h-28 opacity-10 dark:opacity-20 text-primary"
                style={{
                  backgroundImage: 'radial-gradient(circle, currentColor 1.5px, transparent 1.5px)',
                  backgroundSize: '12px 12px',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
