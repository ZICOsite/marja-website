import { CheckCircle2 } from 'lucide-react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

type Stat = {
  id?: string | null
  value: string
  label: string
}

type Achievement = {
  id?: string | null
  text: string
}

type Props = {
  label?: string | null
  heading?: string | null
  description?: string | null
  image?: MediaType | string | number | null
  stats?: Stat[] | null
  achievements?: Achievement[] | null
}

export function CompanyGrowthBlockComponent({
  label,
  heading,
  description,
  image,
  stats,
  achievements,
}: Props) {
  const validStats = (stats ?? []).filter((s): s is Stat => !!s.value && !!s.label)
  const validAchievements = (achievements ?? []).filter((a): a is Achievement => !!a.text)
  const hasImage = image && typeof image === 'object'

  return (
    <section className="py-24 bg-sidebar-accent dark:bg-muted/20 overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {hasImage && (
            <div className="w-full lg:w-5/12 shrink-0 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
                <Media
                  resource={image}
                  className="absolute inset-0 w-full h-full"
                  imgClassName="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                {validStats.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="grid grid-cols-2 gap-3">
                      {validStats.map((stat) => (
                        <div
                          key={stat.value}
                          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                        >
                          <div className="text-2xl font-bold font-heading text-white leading-none mb-1">
                            {stat.value}
                          </div>
                          <div className="text-xs text-white/70 leading-tight">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20 dark:opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                  backgroundSize: '12px 12px',
                }}
              />
            </div>
          )}

          <div className="flex-1">
            {label && (
              <span className="inline-block text-[var(--primary)] font-bold uppercase tracking-widest text-sm mb-4">
                {label}
              </span>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6 leading-tight">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 whitespace-pre-line">
                {description}
              </p>
            )}

            {validAchievements.length > 0 && (
              <ul className="space-y-3">
                {validAchievements.map((a) => (
                  <li key={a.text} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
                    <span className="text-foreground/80 leading-relaxed">{a.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {!hasImage && validStats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
                {validStats.map((stat) => (
                  <div key={stat.value} className="text-center">
                    <div className="text-3xl font-bold font-heading text-[var(--primary)]">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
