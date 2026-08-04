import React from 'react'
import type { CalculatorBlock as CalculatorBlockProps } from '@/payload-types'

import { CalculatorForm } from './Calculator.client'
import { fetchCatalogPrices } from './prices'

type Props = {
  className?: string
  locale?: string
} & CalculatorBlockProps

export const CalculatorBlockComponent = async ({
  tagline,
  heading,
  description,
  showPrices,
  disclaimer,
  locale,
}: Props) => {
  // Цены тянутся из каталога на сервере: клиенту уходит готовая карта,
  // и он считает те же суммы, что потом пересчитает серверный экшен.
  const prices = await fetchCatalogPrices()

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
          prices={prices}
        />
      </div>
    </section>
  )
}
