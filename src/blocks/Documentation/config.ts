import type { Block } from 'payload'

export const DocumentationBlock: Block = {
  slug: 'documentation',
  interfaceName: 'DocumentationBlock',
  labels: {
    singular: 'Documentation (Документация)',
    plural: 'Documentation (Документация)',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      label: 'Заголовок',
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Вкладки',
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: 'Название вкладки',
        },
        {
          name: 'files',
          type: 'array',
          label: 'Файлы',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              localized: true,
              label: 'Название файла',
            },
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Файл',
            },
          ],
        },
      ],
    },
  ],
}
