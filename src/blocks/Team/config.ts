import type { Block } from 'payload'

export const TeamBlock: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: {
    singular: 'Команда',
    plural: 'Команда',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок',
      localized: true,
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Текст',
      localized: true,
    },
    {
      name: 'members',
      type: 'array',
      label: 'Сотрудники',
      minRows: 1,
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Фото',
        },
        {
          name: 'name',
          type: 'text',
          label: 'Имя',
          required: true,
          localized: true,
        },
        {
          name: 'position',
          type: 'text',
          label: 'Должность',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
