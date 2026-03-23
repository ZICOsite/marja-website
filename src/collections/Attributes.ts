import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Attributes: CollectionConfig<'attributes'> = {
  slug: 'attributes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'group', 'unit', 'filterable'],
  },
  access: {
    create: authenticated,
    update: authenticated,
    delete: authenticated,
    read: anyone,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Ключ фильтра. Только латинские буквы, цифры и дефисы (напр. "thickness", "color")',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'text',
      options: [
        { label: 'Текст', value: 'text' },
        { label: 'Число', value: 'number' },
        { label: 'Выбор (select)', value: 'select' },
        { label: 'Флаг (да/нет)', value: 'boolean' },
      ],
    },
    {
      name: 'unit',
      type: 'text',
      admin: {
        description: 'Единица измерения (мм, кг, м², °C и т.д.). Оставьте пустым если не нужно.',
      },
    },
    {
      name: 'group',
      type: 'relationship',
      relationTo: 'attribute-groups',
      admin: {
        position: 'sidebar',
        description: 'Группа для отображения на странице товара',
      },
    },
    {
      name: 'options',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'select',
        description: 'Варианты значений (только для типа "Выбор")',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'Служебный ключ: только латинские буквы, цифры и дефисы' },
        },
      ],
    },
    {
      name: 'filterable',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Показывать в боковых фильтрах каталога',
      },
    },
  ],
}
