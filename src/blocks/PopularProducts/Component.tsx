import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

type ProductItem = {
  id: string
  title: string
  slug?: string | null
  sku?: string | null
  inStock?: boolean | null
  shortDescription?: string | null
  heroImage?: {
    url?: string | null
    alt?: string | null
  } | string | null
}

type Props = {
  tagline?: string | null
  title: string
  description?: string | null
  products?: (ProductItem | string)[] | null
  viewAllLabel?: string | null
  viewAllLink?: string | null
}

export const PopularProductsBlock: React.FC<Props> = ({
  tagline,
  title,
  description,
  products,
  viewAllLabel,
  viewAllLink,
}) => {
  const t = useTranslations('products')

  const populated = (products ?? []).filter(
    (p): p is ProductItem => typeof p === 'object' && p !== null,
  )

  if (populated.length === 0) return null

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Шапка секции */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            {tagline && (
              <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-sm block mb-2">
                {tagline}
              </span>
            )}
            <h2 className="text-4xl md:text-5xl font-bold font-heading">{title}</h2>
            {description && (
              <p className="text-muted-foreground mt-3 max-w-lg text-lg">{description}</p>
            )}
          </div>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2 font-semibold text-[var(--primary)] hover:underline shrink-0 group"
            >
              {viewAllLabel || t('catalog')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {populated.map((product) => {
            const img =
              typeof product.heroImage === 'object' && product.heroImage !== null
                ? product.heroImage
                : null

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug ?? ''}`}
                className="group rounded-2xl overflow-hidden border border-border hover:border-[var(--primary)] transition-colors bg-background flex flex-col"
              >
                {/* Изображение */}
                <div className="relative h-52 overflow-hidden bg-sidebar-accent shrink-0">
                  {img?.url ? (
                    <Image
                      src={img.url}
                      alt={img.alt ?? product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                      <svg
                        className="w-16 h-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Бейдж наличия */}
                  <span
                    className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
                      product.inStock
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.inStock ? t('inStock') : t('outOfStock')}
                  </span>
                </div>

                {/* Контент */}
                <div className="p-5 flex flex-col flex-1">
                  {product.sku && (
                    <p className="text-xs text-muted-foreground font-mono mb-1">{product.sku}</p>
                  )}
                  <h3 className="font-semibold text-base leading-snug group-hover:text-[var(--primary)] transition-colors line-clamp-2 mb-2">
                    {product.title}
                  </h3>
                  {product.shortDescription && (
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                      {product.shortDescription}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t('viewProduct')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
