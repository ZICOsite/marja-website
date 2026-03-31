import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'subLinks',
          type: 'array',
          label: 'Dropdown links',
          maxRows: 8,
          fields: [
            link({
              appearances: false,
            }),
            {
              name: 'description',
              type: 'text',
              label: 'Description',
            },
          ],
          admin: {
            initCollapsed: true,
          },
        },
      ],
      localized: true,
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
