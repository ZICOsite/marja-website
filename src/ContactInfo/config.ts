import type { GlobalConfig } from 'payload'

import { revalidateContactInfo } from './hooks/revalidateTopBar'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phones',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'addresses',
      type: 'array',
      maxRows: 2,
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Ссылка на карту (Google Maps, Yandex Maps и т.д.)',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateContactInfo],
  },
}
