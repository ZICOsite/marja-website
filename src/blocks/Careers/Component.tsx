import type { CareersBlock as CareersBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & CareersBlockProps

export const CareersBlockComponent = ({ heading, photo, sections }: Props) => {
  return (
    <section>
      <div className="container mx-auto px-4">
        {heading && (
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-center mb-8">
            {heading}
          </h1>
        )}

        {photo && (
          <div className="w-full rounded-2xl overflow-hidden mb-16">
            <Media
              resource={photo}
              imgClassName="w-full h-auto object-cover max-h-[480px]"
            />
          </div>
        )}

        {sections && sections.length > 0 && (
          <div className="space-y-16 mb-14">
            {sections.map((section, index) => (
              <div key={index}>
                {section.title && (
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-center mb-8 font-sans">
                    {section.title}
                  </h2>
                )}

                {section.layout === 'twoColumns' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                    {section.content && (
                      <RichText
                        data={section.content}
                        enableGutter={false}
                        className="text-slate-700 dark:text-slate-300 leading-relaxed"
                      />
                    )}
                    {section.contentRight && (
                      <RichText
                        data={section.contentRight}
                        enableGutter={false}
                        className="text-slate-700 dark:text-slate-300 leading-relaxed"
                      />
                    )}
                  </div>
                ) : (
                  section.content && (
                    <RichText
                      data={section.content}
                      enableGutter={false}
                      className="text-center text-slate-700 dark:text-slate-300 leading-relaxed space-y-4"
                    />
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
