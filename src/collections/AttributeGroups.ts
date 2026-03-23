import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const AttributeGroups: CollectionConfig<'attribute-groups'> = {
  slug: 'attribute-groups',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
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
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Порядок отображения групп в карточке товара',
      },
    },
  ],
}
