import type { Block } from 'payload'

export const Features: Block = {
  slug: 'features', // Важно: этот slug должен совпадать с ключом в RenderBlocks
  interfaceName: 'FeaturesBlock',
  labels: {
    singular: 'Features (Преимущества)',
    plural: 'Features (Преимущества)',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Список преимуществ',
      minRows: 1,
      maxRows: 4, // Ограничим 4, чтобы дизайн не ломался (опционально)
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Иконка',
          required: true,
          defaultValue: 'shieldCheck',
          options: [
            { label: 'Бесконечность (Всегда в наличии)', value: 'infinity' },
            { label: 'Процент (Доступные цены)', value: 'badgePercent' },
            { label: 'Щит (Гарантия)', value: 'shieldCheck' },
            { label: 'Завод (Производство)', value: 'factory' },
            // Сюда можно добавлять новые иконки позже
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок карточки',
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