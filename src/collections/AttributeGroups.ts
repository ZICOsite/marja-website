import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateCatalogAfterChange, revalidateCatalogAfterDelete } from '@/hooks/revalidateCatalog'

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
  hooks: {
    afterChange: [revalidateCatalogAfterChange],
    afterDelete: [revalidateCatalogAfterDelete],
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
