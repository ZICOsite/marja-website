import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { link } from '../../fields/link'

export const AboutCompanyBlock: Block = {
  slug: 'aboutCompany',
  interfaceName: 'AboutCompanyBlock',
  labels: {
    singular: 'About Company',
    plural: 'About Company Blocks',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      localized: true,
      required: true,
      label: 'Badge / Eyebrow Text',
      admin: {
        description: 'Small label above the heading (e.g. "Наша история")',
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      label: 'Heading',
    },
    {
      name: 'titleHighlight',
      type: 'text',
      localized: true,
      label: 'Heading Highlight',
      admin: {
        description: 'Part of the heading rendered in accent color',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: 'Description',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'statValue',
          type: 'text',
          label: 'Stat Value',
          admin: {
            width: '50%',
            description: 'e.g. "15+"',
          },
        },
        {
          name: 'statLabel',
          type: 'text',
          localized: true,
          label: 'Stat Label',
          admin: {
            width: '50%',
            description: 'e.g. "Лет на рынке Узбекистана"',
          },
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Feature Cards',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          required: true,
          defaultValue: 'shield',
          options: [
            { label: 'Shield Check', value: 'shield' },
            { label: 'Factory', value: 'factory' },
            { label: 'Check Circle', value: 'check' },
            { label: 'Award', value: 'award' },
            { label: 'Zap', value: 'zap' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
          label: 'Title',
        },
        {
          name: 'description',
          type: 'text',
          localized: true,
          label: 'Description',
        },
      ],
    },
    link({
      appearances: false,
      overrides: {
        name: 'button',
        label: 'Button',
      },
    }),
  ],
}
