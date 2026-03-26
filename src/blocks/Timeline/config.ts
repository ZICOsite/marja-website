import type { Block } from 'payload'

export const TimelineBlock: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: {
    singular: 'Timeline (История компании)',
    plural: 'Timeline (История компании)',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'События',
      minRows: 1,
      fields: [
        {
          name: 'year',
          type: 'text',
          label: 'Год',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок события',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Описание',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
