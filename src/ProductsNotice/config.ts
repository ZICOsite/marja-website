import type { GlobalConfig } from 'payload'

import { revalidateProductsNotice } from './hooks/revalidate'

export const ProductsNotice: GlobalConfig = {
  slug: 'products-notice',
  label: 'Подсказка на странице каталога',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Показывать подсказку',
      defaultValue: false,
    },
    {
      name: 'position',
      type: 'select',
      label: 'Позиция',
      defaultValue: 'below',
      options: [
        { label: 'Над списком категорий', value: 'above' },
        { label: 'Под списком категорий', value: 'below' },
      ],
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Текст подсказки',
      localized: true,
      admin: {
        description: 'Текст отображается в карточке-подсказке на странице каталога',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateProductsNotice],
  },
}
