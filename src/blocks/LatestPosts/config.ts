import type { Block } from 'payload'

export const LatestPosts: Block = {
  slug: 'latestPosts',
  interfaceName: 'LatestPostsBlock',
  labels: {
    singular: 'Latest Posts',
    plural: 'Latest Posts Blocks',
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'viewAllLabel',
      type: 'text',
      localized: true,
    },
    {
      name: 'viewAllLink',
      type: 'text',
    },
  ],
}
