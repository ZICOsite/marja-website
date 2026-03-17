import type { Block } from 'payload'

export const Solutions: Block = {
  slug: 'solutions', // Важно: этот slug должен совпадать с ключом в RenderBlocks
  interfaceName: 'SolutionsBlock',
  labels: {
    singular: 'Solutions (Решения)',
    plural: 'Solutions (Решения)',
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      label: 'Надзаголовок',
      defaultValue: 'Готовые системы',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      defaultValue: 'Комплексные решения',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      localized: true,
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Карточки решений',
      minRows: 1,
      maxRows: 2, // В твоем дизайне 2 колонки, можно ограничить
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Фоновое изображение',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок карточки',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Краткое описание',
          localized: true,
        },
        {
          name: 'type',
          type: 'select',
          label: 'Иконка',
          defaultValue: 'foundation',
          options: [
            { label: 'Фундамент (ShieldCheck)', value: 'foundation' },
            { label: 'Кровля (Factory)', value: 'roof' },
          ],
        },
        {
          name: 'link',
          type: 'text',
          label: 'Ссылка',
          defaultValue: '#!',
        },
      ],
    },
  ],
}
