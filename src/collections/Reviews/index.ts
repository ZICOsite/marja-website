import type { Access, CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

const authenticatedOrApproved: Access = ({ req: { user } }) => {
  if (user) return true
  return { approved: { equals: true } }
}

export const Reviews: CollectionConfig<'reviews'> = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'product', 'rating', 'approved', 'createdAt'],
  },
  access: {
    create: anyone,
    read: authenticatedOrApproved,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      admin: { description: 'Компания или организация (необязательно)' },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: { position: 'sidebar' },
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Опубликовать отзыв на сайте',
      },
    },
  ],
}
