import type { Block } from 'payload'

export const WarrantyFeaturesBlock: Block = {
  slug: 'warrantyFeatures',
  interfaceName: 'WarrantyFeaturesBlock',
  labels: {
    singular: 'Warranty Features (Гарантия качества от Marja)',
    plural: 'Warranty Features (Гарантия качества от Marja)',
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
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Фоновое изображение',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Карточки гарантий',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Иконка',
          defaultValue: 'shieldCheck',
          options: [
            { label: 'Щит (Гарантия)', value: 'shieldCheck' },
            { label: 'Завод (Производство)', value: 'factory' },
            { label: 'Пользователи (Клиенты)', value: 'users' },
            { label: 'Звезда (Качество)', value: 'star' },
            { label: 'Медаль (Награда)', value: 'award' },
            { label: 'Галочка (Проверено)', value: 'badgeCheck' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок карточки',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
