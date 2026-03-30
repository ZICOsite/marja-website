import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { defaultLexical } from '@/fields/defaultLexical'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      label: 'Описание компании',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      localized: true,
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'companyLinks',
      label: 'Колонка "Компания"',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      localized: true,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'productLinks',
      label: 'Колонка "Продукция"',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      localized: true,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'privacyPolicy',
      label: 'Политика конфиденциальности',
      type: 'richText',
      editor: defaultLexical,
      localized: true,
    },
    {
      name: 'termsOfUse',
      label: 'Условия использования',
      type: 'richText',
      editor: defaultLexical,
      localized: true,
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
