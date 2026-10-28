import { User } from 'lucide-react'
import type { TeamBlock as TeamBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import { BrandGraphic } from '@/components/BrandGraphic'

type Props = {
  className?: string
} & TeamBlockProps

export const TeamBlockComponent = ({ heading, text, members }: Props) => {
  return (
    <section className="relative overflow-hidden">
      {/* Брендбук п. 5: полоса окон над заголовком, растворяется вниз */}
      <BrandGraphic
        variant="windows"
        className="inset-x-0 top-0 h-72 text-marja-navy/6 [--windows-fade:linear-gradient(to_bottom,#000,transparent)]"
      />
      <div className="container relative mx-auto px-4">
        {(heading || text) && (
          <div className="max-w-4xl mb-14 mx-auto text-center">
            {heading && (
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 leading-tight">
                {heading}
              </h2>
            )}
            {text && (
              <p className="text-muted-foreground text-lg leading-relaxed">{text}</p>
            )}
          </div>
        )}

        {members && members.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="w-full aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  {member.photo ? (
                    <Media
                      resource={member.photo}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-marja-grey" strokeWidth={1.5} />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-foreground font-sans">
                    {member.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {member.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
