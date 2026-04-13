import type { Block } from 'payload'

export const DownloadsBlock: Block = {
  slug: 'downloads',
  interfaceName: 'DownloadsBlock',
  labels: {
    singular: 'Downloads (Материалы для скачивания)',
    plural: 'Downloads (Материалы для скачивания)',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      label: 'Заголовок',
    },
    {
      name: 'files',
      type: 'array',
      label: 'Файлы',
      minRows: 1,
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
}
