import React from 'react'
import type { StatsBlock as StatsBlockProps } from '@/payload-types'

type Props = {
  className?: string
} & StatsBlockProps

export const StatsBlock: React.FC<Props> = ({ items }) => {
  return (
    <section className="py-20 bg-blue-600 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary -skew-x-12 translate-x-1/2 opacity-50"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-white">
          {items?.map((item, i) => (
            <div key={i}>
              <div className="text-5xl font-bold font-heading mb-2">
                {item.value}
              </div>

              <div className="text-blue-100 font-medium uppercase tracking-widest text-sm">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}