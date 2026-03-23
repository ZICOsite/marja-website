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
import {
  revalidateDeleteProductCategory,
  revalidateProductCategory,
} from './hooks/revalidateProductCategory'

export const ProductCategories: CollectionConfig<'product-categories'> = {
  slug: 'product-categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const crumbs = data?.breadcrumbs
        const breadcrumbUrl =
          Array.isArray(crumbs) && crumbs.length > 0
            ? (crumbs[crumbs.length - 1] as { url?: string })?.url ?? `/${data?.slug}`
            : `/${data?.slug}`
        return generatePreviewPath({
          slug: `products${breadcrumbUrl}`,
          collection: 'product-categories',
          req,
          locale: (req.locale as string) || 'uz',
        })
      },
    },
    preview: (data, { req }) => {
      const crumbs = data?.breadcrumbs as Array<{ url?: string }> | undefined
      const breadcrumbUrl =
        Array.isArray(crumbs) && crumbs.length > 0
          ? crumbs[crumbs.length - 1]?.url ?? `/${data?.slug}`
          : `/${data?.slug}`
      return generatePreviewPath({
        slug: `products${breadcrumbUrl}`,
        collection: 'product-categories',
        req,
        locale: (req.locale as string) || 'uz',
      })
    },
  },
  access: {
    create: authenticated,
    update: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
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
              name: 'description',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
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
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    // 'parent' и 'breadcrumbs' добавляет nestedDocsPlugin автоматически
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateProductCategory],
    afterDelete: [revalidateDeleteProductCategory],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
