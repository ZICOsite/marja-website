import type { Block } from 'payload'

export const ReadySolutionsBlock: Block = {
  slug: 'readySolutions',
  interfaceName: 'ReadySolutionsBlock',
  labels: {
    singular: 'Готовые решения',
    plural: 'Готовые решения',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      localized: true,
    },
    {
      name: 'tabs',
      type: 'array',
      label: 'Сегменты (вкладки)',
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Название вкладки',
          localized: true,
          required: true,
        },
        {
          name: 'schemeImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Схема (3D-разрез)',
        },
        {
          name: 'sections',
          type: 'array',
          label: 'Разделы аккордеона',
          minRows: 1,
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Заголовок раздела',
              localized: true,
              required: true,
            },
            {
              name: 'content',
              type: 'textarea',
              label: 'Описание',
              localized: true,
            },
          ],
        },
      ],
    },
  ],
}
