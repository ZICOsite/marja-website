import React from 'react'
import type { StatsBlock as StatsBlockProps } from '@/payload-types'

type Props = {
  className?: string
} & StatsBlockProps

export const StatsBlock: React.FC<Props> = ({ items }) => {
  return (
    <section className="py-20 bg-primary dark:bg-blue-900 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 select-none bg-repeat"
        style={{
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' stroke='%23ffffff' stroke-miterlimit='10' stroke-dasharray='4 4' opacity='0.15'%3E%3Cline x1='0.5' y1='0.5' x2='63.5' y2='63.5' /%3E%3Cline x1='63.5' y1='0.5' x2='0.5' y2='63.5' /%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-white">
          {items?.map((item, i) => (
            <div key={i}>
              <div className="text-5xl font-bold font-heading mb-2">{item.value}</div>

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
