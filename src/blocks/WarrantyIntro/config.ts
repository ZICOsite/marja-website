import type { Block } from 'payload'

export const WarrantyIntroBlock: Block = {
  slug: 'warrantyIntro',
  interfaceName: 'WarrantyIntroBlock',
  labels: {
    singular: 'Warranty Intro (Гарантия сквозь года)',
    plural: 'Warranty Intro (Гарантия сквозь года)',
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
      name: 'text',
      type: 'textarea',
      label: 'Текст',
      required: true,
      localized: true,
    },
    {
      name: 'years',
      type: 'text',
      label: 'Лет гарантии (например: 25)',
      defaultValue: '25',
    },
  ],
}
