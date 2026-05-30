import './style.css'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import { DynamicTitle } from '@/components/DynamicTitle'
import { useTranslations } from 'next-intl'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const CallToActionBlock = ({ title, titleTag = 'h2', links, richText }: CTABlockProps) => {
  const t = useTranslations()

  return (
    <div className="CallToAction">
      <div className="container">
        <div className="CallToAction__content max-w-3xl">
          <p className="bg-[var(--primary)] px-3 py-1 text-white text-xs font-bold uppercase tracking-widest rounded-full">
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
              return <CMSLink key={i} size="lg" {...link} className='font-sans uppercase' />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
