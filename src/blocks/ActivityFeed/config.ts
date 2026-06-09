import type { Block } from 'payload'

export const ActivityFeedBlock: Block = {
  slug: 'activityFeed',
  interfaceName: 'ActivityFeedBlock',
  labels: {
    singular: 'Activity Feed (Лента событий)',
    plural: 'Activity Feed (Лента событий)',
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      label: 'Надзаголовок',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Заголовок секции',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Описание',
    },
  ],
}
