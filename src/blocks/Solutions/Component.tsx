import React from 'react'
import { Factory, ShieldCheck, ArrowRight, LucideIcon } from 'lucide-react'
import type { SolutionsBlock as SolutionsBlockProps } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const iconMap: Record<string, LucideIcon> = {
  foundation: ShieldCheck,
  roof: Factory,
}

type Props = {
  className?: string
} & SolutionsBlockProps

export const SolutionsBlock: React.FC<Props> = ({ tagline, title, description, cards }) => {
  const t = useTranslations('solutions')
  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            {tagline && (
              <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-sm">
                {tagline}
              </span>
            )}
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2">
                {title}
              </h2>
            )}
          </div>
          {description && <p className="max-w-lg mt-4 md:mt-0">{description}</p>}
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards?.map((card, index) => {
            // Определяем иконку по типу (default = ShieldCheck, чтобы не упало)
            const IconComponent = card.type ? iconMap[card.type] : ShieldCheck

            // Обработка картинки (Payload возвращает объект или ID)
            const imgUrl = typeof card.image === 'object' && card.image?.url ? card.image.url : ''
            const imgAlt =
              typeof card.image === 'object' && card.image?.alt ? card.image.alt : card.title

            return (
              <Link
                key={index}
                href={card.link || '#!'}
                className="relative group overflow-hidden rounded-3xl h-[400px] block"
              >
                {imgUrl && (
                  <Image
                    src={imgUrl}
                    alt={imgAlt || 'System image'}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="text-white w-6 h-6" />
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-white/70 mb-4 line-clamp-2 font-sans">{card.description}</p>

                  <button className="flex items-center text-[var(--primary)] font-sans font-bold group-hover:underline">
                    {t('viewSystem')} <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
