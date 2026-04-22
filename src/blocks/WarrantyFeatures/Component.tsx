import { ShieldCheck, Factory, Users, Star, Award, BadgeCheck, type LucideIcon } from 'lucide-react'
import { Media } from '@/components/Media'

const iconMap: Record<string, LucideIcon> = {
  shieldCheck: ShieldCheck,
  factory: Factory,
  users: Users,
  star: Star,
  award: Award,
  badgeCheck: BadgeCheck,
}

type MediaType = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

type Item = {
  id?: string | null
  icon?: string | null
  title: string
}

type Props = {
  heading?: string | null
  description?: string | null
  backgroundImage?: MediaType | string | number | null
  items?: Item[] | null
}

export function WarrantyFeaturesBlockComponent({
  heading,
  description,
  backgroundImage,
  items,
}: Props) {
  const validItems = (items ?? []).filter((i): i is Item => !!i.title)
  const hasImage = backgroundImage && typeof backgroundImage === 'object'

  return (
    <section className="relative py-28 overflow-hidden">
      {hasImage ? (
        <>
          <Media
            resource={backgroundImage}
            className="absolute inset-0 w-full h-full"
            imgClassName="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
      )}

      <div className="relative z-10 container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          {heading && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-4">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-white/70 text-lg leading-relaxed">{description}</p>
          )}
        </div>

        {validItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {validItems.map((item) => {
              const Icon = iconMap[item.icon ?? ''] ?? ShieldCheck
              return (
                <div
                  key={item.title}
                  className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg leading-snug">{item.title}</h3>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
