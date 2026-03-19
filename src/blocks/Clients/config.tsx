import type { Block } from 'payload'

export const ClientsBlock: Block = {
  slug: 'clients',
  interfaceName: 'ClientsBlock',
  labels: {
    singular: 'Clients (Наши клиенты)',
    plural: 'Clients (Наши клиенты)',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      label: 'Heading',
      defaultValue: 'Наши клиенты',
    },
    {
      name: 'clients',
      type: 'array',
      label: 'Clients',
      minRows: 1,
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Logo',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Client Name',
          admin: {
            description: 'Used as alt text for the logo image',
          },
        },
      ],
    },
  ],
}
