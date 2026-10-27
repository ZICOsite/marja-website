import { ArrowRight, Award, CheckCircle, Factory, LucideIcon, ShieldCheck, Zap } from 'lucide-react'

import type { AboutCompanyBlock as AboutCompanyBlockProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

const iconMap: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  factory: Factory,
  check: CheckCircle,
  award: Award,
  zap: Zap,
}

type Props = {
  className?: string
  locale?: string
} & AboutCompanyBlockProps

export const AboutCompanyBlock = ({
  label,
  title,
  titleHighlight,
  description,
  image,
  statValue,
  statLabel,
  features,
  button,
  locale,
}: Props) => {
  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start lg:flex-row gap-16">
          <div className="w-full lg:w-1/2 relative">
            <div className="hidden lg:block absolute -top-10 -left-10 w-40 h-40 bg-marja-navy/5 rounded-full -z-10"></div>
            <div className="hidden lg:block absolute -bottom-10 -right-10 w-64 h-64 bg-marja-navy/10 rounded-full -z-10"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {image && (
                <Media
                  resource={image}
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition duration-500"
                  imgClassName="w-full h-auto object-cover max-h-[400px] lg:max-h-none"
                  size="(max-width: 1024px) 100vw, 50vw"
                />
              )}
              {(statValue || statLabel) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-marja-navy/90 to-transparent text-white">
                  <div className="flex items-center space-x-4">
                    {statValue && (
                      <div className="text-2xl md:text-4xl font-bold font-heading">{statValue}</div>
                    )}
                    {statLabel && (
                      <div className="text-xs md:text-sm leading-tight opacity-80 uppercase tracking-wider font-bold">
                        {statLabel}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/2">
            {label && (
              <span className="text-primary font-bold uppercase tracking-widest text-sm">
                {label}
              </span>
            )}
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold font-heading mt-4 mb-8 leading-tight">
                {title} {titleHighlight && <span className="text-primary">{titleHighlight}</span>}
              </h2>
            )}
            {description && (
              <RichText
                data={description}
                enableGutter={false}
                className="text-muted-foreground text-lg leading-relaxed mb-6"
              />
            )}

            {features && features.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                {features.map((feature, i) => {
                  const Icon = iconMap[feature.icon] ?? iconMap.shield
                  return (
                    <div
                      key={i}
                      className="flex items-start space-x-4 p-4 bg-white rounded-2xl shadow-sm"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="text-primary w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground font-sans text-base">{feature.title}</h3>
                        {feature.description && (
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {button?.label && (
              <div className="mt-12">
                <CMSLink
                  {...button}
                  locale={locale}
                  className="font-sans px-8 py-4 bg-primary hover:bg-marja-navy text-white font-bold rounded-xl transition inline-flex items-center group shadow-xl shadow-marja-navy/20"
                >
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </CMSLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
