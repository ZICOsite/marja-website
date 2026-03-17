import type { Block } from 'payload'

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    singular: 'Stats (Статистика)',
    plural: 'Stats (Статистика)',
  },
  fields: [
    {
      name: 'items',
      label: 'Statistics Items',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'value',
          label: 'Value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
