import React from 'react'
import type { CalculatorBlock as CalculatorBlockProps } from '@/payload-types'

import { BrandGraphic } from '@/components/BrandGraphic'

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
    <section className="relative overflow-hidden py-20 bg-background">
      {/* Брендбук п. 5: паттерн окон по краям секции, к форме растворяется */}
      <BrandGraphic
        variant="windows"
        className="inset-0 text-marja-navy/8 [--windows-fade:linear-gradient(to_right,#000,transparent_25%,transparent_75%,#000)]"
      />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {tagline && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              {tagline}
            </p>
          )}
          {heading && (
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              {heading}
            </h2>
          )}
          {description && <p className="mt-4 text-muted-foreground">{description}</p>}
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
