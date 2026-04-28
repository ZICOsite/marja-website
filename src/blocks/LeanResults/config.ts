import type { Block } from 'payload'

export const LeanResultsBlock: Block = {
  slug: 'leanResults',
  interfaceName: 'LeanResultsBlock',
  labels: {
    singular: 'Lean Results (Результаты бережливого производства)',
    plural: 'Lean Results (Результаты бережливого производства)',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      localized: true,
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Показатели',
      maxRows: 4,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Значение (например: 40%)',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Подпись',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'comparisons',
      type: 'array',
      label: 'Сравнения до / после',
      maxRows: 6,
      fields: [
        {
          name: 'metric',
          type: 'text',
          label: 'Метрика',
          required: true,
          localized: true,
        },
        {
          name: 'before',
          type: 'text',
          label: 'До',
          required: true,
          localized: true,
        },
        {
          name: 'after',
          type: 'text',
          label: 'После',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
