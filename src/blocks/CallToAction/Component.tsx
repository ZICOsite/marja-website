import './style.css'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import { DynamicTitle } from '@/components/DynamicTitle'
import { useTranslations } from 'next-intl'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { BrandGraphic } from '@/components/BrandGraphic'

export const CallToActionBlock = ({ title, titleTag = 'h2', links, richText, locale }: CTABlockProps & { locale?: string }) => {
  const t = useTranslations()

  return (
    <div className="CallToAction relative overflow-hidden">
      <div className="container relative">
        {/* Брендбук п. 5: буква «M» у правого края контейнера, как на 404 */}
        <BrandGraphic
          variant="m"
          className="right-0 top-1/2 h-full -translate-y-1/2 text-marja-navy/6"
        />
        <div className="CallToAction__content relative max-w-3xl">
          <p className="bg-marja-gold px-3 py-1 text-marja-navy text-xs font-bold uppercase tracking-widest rounded-full">
            {t('cta.abovetitle')}
          </p>
          {title && (
            <DynamicTitle
              as={titleTag}
              className="text-3xl md:text-5xl font-bold leading-tight"
            >
              {title}
            </DynamicTitle>
          )}
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
          <div className="flex gap-4 md:gap-8 flex-wrap">
            {(links || []).map(({ link }, i) => {
              return <CMSLink key={i} size="lg" {...link} locale={locale} className='font-sans uppercase' />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
