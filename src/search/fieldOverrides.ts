import { Field } from 'payload'

export const searchFields: Field[] = [
  {
    name: 'slug',
    type: 'text',
    index: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'meta',
    label: 'Meta',
    type: 'group',
    index: true,
    admin: {
      readOnly: true,
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Title',
      },
      {
        type: 'text',
        name: 'description',
        label: 'Description',
      },
      {
        name: 'image',
        label: 'Image',
        type: 'upload',
        relationTo: 'media',
      },
    ],
  },
  {
    label: 'Categories',
    name: 'categories',
    type: 'array',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'relationTo',
        type: 'text',
      },
      {
        name: 'categoryID',
        type: 'text',
      },
      {
        name: 'title',
        type: 'text',
      },
    ],
  },
  {
    name: 'sku',
    type: 'text',
    index: true,
    admin: { readOnly: true },
  },
  {
    name: 'shortDescription',
    type: 'text',
    admin: { readOnly: true },
  },
  {
    name: 'heroImage',
    label: 'Hero Image',
    type: 'upload',
    relationTo: 'media',
    admin: { readOnly: true },
  },
  {
    name: 'inStock',
    type: 'checkbox',
    admin: { readOnly: true },
  },
  {
    name: 'price',
    type: 'number',
    admin: { readOnly: true },
  },
  {
    name: 'currency',
    type: 'text',
    admin: { readOnly: true },
  },
  {
    name: 'priceOnRequest',
    type: 'checkbox',
    admin: { readOnly: true },
  },
]
