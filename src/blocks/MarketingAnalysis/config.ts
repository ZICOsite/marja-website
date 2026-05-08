import type { Block } from 'payload'

export const MarketingAnalysisBlock: Block = {
  slug: 'marketingAnalysis',
  interfaceName: 'MarketingAnalysisBlock',
  labels: {
    singular: 'Marketing Analysis (Маркетинговый анализ)',
    plural: 'Marketing Analysis (Маркетинговый анализ)',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок',
      localized: true,
    },
    {
      name: 'series1Label',
      type: 'text',
      label: 'Подпись метрики 1',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Годы',
      minRows: 1,
      fields: [
        {
          name: 'year',
          type: 'text',
          label: 'Год',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Описание',
          localized: true,
        },
        {
          name: 'value1',
          type: 'number',
          label: 'Значение метрики 1',
        },
      ],
    },
  ],
}
