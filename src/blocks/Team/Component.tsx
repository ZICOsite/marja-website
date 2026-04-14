import { User } from 'lucide-react'
import type { TeamBlock as TeamBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'

type Props = {
  className?: string
} & TeamBlockProps

export const TeamBlockComponent = ({ heading, text, members }: Props) => {
  return (
    <section>
      <div className="container mx-auto px-4">
        {(heading || text) && (
          <div className="max-w-4xl mb-14 mx-auto text-center">
            {heading && (
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 leading-tight">
                {heading}
              </h2>
            )}
            {text && (
              <p className="text-slate-600 dark:text-white text-lg leading-relaxed">{text}</p>
            )}
          </div>
        )}

        {members && members.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="w-full aspect-square bg-blue-50 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                  {member.photo ? (
                    <Media
                      resource={member.photo}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-blue-200 dark:text-slate-500" strokeWidth={1.5} />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white font-sans">
                    {member.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
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
