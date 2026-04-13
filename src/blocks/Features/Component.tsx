import type { FeaturesBlock as FeaturesBlockProps } from '@/payload-types'
import { BadgePercent, Factory, Infinity, ShieldCheck, LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  infinity: Infinity,
  badgePercent: BadgePercent,
  shieldCheck: ShieldCheck,
  factory: Factory,
}

type Props = {
  className?: string
} & FeaturesBlockProps

export const FeaturesBlock = ({ items }: Props) => {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items?.map((item, i) => {
            const IconComponent = item.icon ? iconMap[item.icon] : ShieldCheck

            return (
              <div
                key={i}
                className="group p-8 rounded-md border border-sidebar-accent bg-sidebar-accent dark:bg-transparent hover:bg-[var(--primary)] dark:hover:bg-[var(--primary)] transition-all duration-300"
              >
                <div className="w-16 h-16 bg-white rounded-md shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-white">
                  {item.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-blue-100 transition-colors">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
