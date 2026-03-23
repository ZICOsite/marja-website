import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { flattenSpecifications } from './hooks/flattenSpecifications'
import { revalidateDeleteProduct, revalidateProduct } from './hooks/revalidateProduct'

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sku', 'categories', 'inStock', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
          locale: (req.locale as string) || 'uz',
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
        locale: (req.locale as string) || 'uz',
      }),
  },
  access: {
    create: authenticated,
    update: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    heroImage: true,
    shortDescription: true,
    categories: true,
    inStock: true,
    sku: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Дополнительные фото',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              admin: { description: 'Краткое описание для карточки в каталоге (1-2 предложения)' },
            },
            {
              name: 'description',
              type: 'richText',
              localized: true,
            },
            {
              name: 'documents',
              type: 'array',
              label: 'Документы (PDF, чертежи)',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Название (напр. "Технический паспорт")' },
                },
              ],
            },
          ],
        },
        {
          label: 'Характеристики',
          fields: [
            {
              name: 'specifications',
              type: 'array',
              label: 'Технические характеристики',
              admin: {
                description:
                  'Характеристики товара. Для select-атрибутов в поле "Значение" введите value из опций атрибута.',
              },
              fields: [
                {
                  name: 'attribute',
                  type: 'relationship',
                  relationTo: 'attributes',
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'filterValues',
              type: 'array',
              label: 'Значения фильтров (авто)',
              admin: {
                disabled: true,
                readOnly: true,
                description: 'Заполняется автоматически из характеристик с пометкой "filterable"',
              },
              fields: [{ name: 'value', type: 'text' }],
            },
          ],
        },
        {
          label: 'Связи',
          fields: [
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              filterOptions: ({ id }) => ({ id: { not_in: [id] } }),
              admin: {
                description: 'Похожие и сопутствующие товары, отображаются внизу страницы',
                initCollapsed: true,
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Категории, в которых отображается товар',
      },
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Артикул товара (уникальный)',
      },
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateProduct],
    beforeChange: [populatePublishedAt, flattenSpecifications],
    afterDelete: [revalidateDeleteProduct],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
