import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'MARJA — производитель систем водоснабжения и канализации.',
  images: [
    {
      url: `${getServerSideURL()}/og-default.jpg`,
    },
  ],
  siteName: 'MARJA',
  title: 'MARJA',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
