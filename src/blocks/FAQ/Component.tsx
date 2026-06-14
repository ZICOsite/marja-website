import React from 'react'
import type { FAQBlock as FAQBlockProps } from '@/payload-types'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type Props = {
  className?: string
} & FAQBlockProps

export const FAQBlockComponent = ({ tagline, title, description, items }: Props) => {
  const faqItems = (items ?? []).filter((item) => item?.question && item?.answer)

  if (faqItems.length === 0) return null

  // Структурированные данные FAQPage для расширенных результатов Google.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            {tagline && (
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                {tagline}
              </p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-gray-600 dark:text-gray-300">{description}</p>
            )}
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base md:text-lg text-gray-900 dark:text-white">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
