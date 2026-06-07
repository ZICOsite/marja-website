import type { Block } from 'payload'

export const PopularProducts: Block = {
  slug: 'popularProducts',
  interfaceName: 'PopularProductsBlock',
  labels: {
    singular: 'Popular Products (Популярные товары)',
    plural: 'Popular Products (Популярные товары)',
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      label: 'Надзаголовок',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Заголовок секции',
      defaultValue: 'Популярные товары',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Описание',
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 9,
      label: 'Товары',
      admin: {
        description: 'Выберите от 1 до 9 товаров для отображения в блоке',
      },
    },
    {
      name: 'viewAllLabel',
      type: 'text',
      localized: true,
      label: 'Текст кнопки "Смотреть все"',
      admin: {
        description: 'Если не заполнено — используется перевод из файлов локализации',
      },
    },
    {
      name: 'viewAllLink',
      type: 'text',
      label: 'Ссылка "Смотреть все"',
      admin: {
        description: 'Относительный путь, например /products. Если пусто — кнопка не показывается',
      },
    },
  ],
}
