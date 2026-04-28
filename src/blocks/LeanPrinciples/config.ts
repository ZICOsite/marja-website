import type { Block } from 'payload'

export const LeanPrinciplesBlock: Block = {
  slug: 'leanPrinciples',
  interfaceName: 'LeanPrinciplesBlock',
  labels: {
    singular: 'Lean Principles (Принципы бережливого производства)',
    plural: 'Lean Principles (Принципы бережливого производства)',
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
      name: 'principles',
      type: 'array',
      label: 'Принципы',
      minRows: 1,
      maxRows: 7,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название',
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
