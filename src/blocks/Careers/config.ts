import type { Block } from 'payload'
import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const CareersBlock: Block = {
  slug: 'careers',
  interfaceName: 'CareersBlock',
  labels: {
    singular: 'Карьера',
    plural: 'Карьера',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок страницы',
      localized: true,
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Фото команды',
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Разделы',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок раздела',
          localized: true,
          required: true,
        },
        {
          name: 'layout',
          type: 'select',
          label: 'Расположение текста',
          defaultValue: 'oneColumn',
          options: [
            { label: 'Один столбец', value: 'oneColumn' },
            { label: 'Два столбца', value: 'twoColumns' },
          ],
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Текст (левый столбец)',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
        {
          name: 'contentRight',
          type: 'richText',
          label: 'Текст (правый столбец)',
          localized: true,
          admin: {
            condition: (_, siblingData) => siblingData?.layout === 'twoColumns',
          },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
  ],
}
