import { PayloadRequest } from 'payload'

const collectionPrefixMap: Record<string, string> = {
  posts: '/posts',
  pages: '',
  products: '/products',
  'product-categories': '/products',
}

type Props = {
  collection: string
  slug: string
  req: PayloadRequest
  locale?: string
}

export const generatePreviewPath = ({ collection, slug, locale = 'uz' }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path: `/${locale}${collectionPrefixMap[collection] ?? ''}/${encodedSlug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
    locale,
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
