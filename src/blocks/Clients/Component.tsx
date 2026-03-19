import React from 'react'
import { Marquee } from '@/components/Marquee'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

type ClientItem = {
  id?: string | null
  name: string
  logo: MediaType | string | number
}

type Props = {
  heading?: string | null
  clients?: ClientItem[] | null
}

export const ClientsBlock: React.FC<Props> = ({ heading, clients }) => {
  if (!clients || clients.length === 0) return null

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {heading && (
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-center mb-4">
            {heading}
          </h2>
        )}
        <div className="w-16 h-1 bg-primary mx-auto mb-12 rounded-full" />
      <Marquee>
        {clients.map((client, i) => (
          <div
            key={i}
            className="mx-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
          >
            <Media
              resource={client.logo}
              imgClassName="h-24 w-auto object-contain"
              alt={client.name}
            />
          </div>
        ))}
      </Marquee>
      </div>

    </section>
  )
}
