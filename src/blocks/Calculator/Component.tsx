import React from 'react'
import type { CalculatorBlock as CalculatorBlockProps } from '@/payload-types'

import { CalculatorForm } from './Calculator.client'

type Props = {
  className?: string
  locale?: string
} & CalculatorBlockProps

export const CalculatorBlockComponent = ({
  tagline,
  heading,
  description,
  showPrices,
  disclaimer,
  locale,
}: Props) => {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {tagline && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              {tagline}
            </p>
          )}
          {heading && (
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              {heading}
            </h2>
          )}
          {description && <p className="mt-4 text-gray-600 dark:text-gray-300">{description}</p>}
        </div>

        <CalculatorForm
          showPrices={showPrices !== false}
          disclaimer={disclaimer}
          locale={locale}
        />
      </div>
    </section>
  )
}
