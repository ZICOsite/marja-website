import type { Block } from 'payload'

export const CompanyGrowthBlock: Block = {
  slug: 'companyGrowth',
  interfaceName: 'CompanyGrowthBlock',
  labels: {
    singular: 'Company Growth (Рост и успех компании)',
    plural: 'Company Growth (Рост и успех компании)',
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
      label: 'Фото',
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
          label: 'Значение (например: 25+)',
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
      name: 'achievements',
      type: 'array',
      label: 'Достижения (список)',
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
