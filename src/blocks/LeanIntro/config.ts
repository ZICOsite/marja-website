import type { Block } from 'payload'

export const LeanIntroBlock: Block = {
  slug: 'leanIntro',
  interfaceName: 'LeanIntroBlock',
  labels: {
    singular: 'Lean Intro (Бережливое производство: Введение)',
    plural: 'Lean Intro (Бережливое производство: Введение)',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Метка над заголовком',
      localized: true,
    },
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Изображение',
    },
    {
      name: 'points',
      type: 'array',
      label: 'Ключевые пункты',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Текст',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
