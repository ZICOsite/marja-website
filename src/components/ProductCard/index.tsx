import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/utilities/formatPrice'

type ProductCardProps = {
  href: string
  title: string
  sku?: string | null
  inStock?: boolean | null
  heroImage?: unknown
  shortDescription?: string | null
  price?: number | null
  priceOnRequest?: boolean | null
  currency?: string | null
  locale: string
}

export async function ProductCard({
  href,
  title,
  sku,
  inStock,
  heroImage,
  shortDescription,
  price,
  priceOnRequest,
  currency,
  locale,
}: ProductCardProps) {
  const t = await getTranslations({ locale, namespace: 'products' })
  const img =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as { url?: string | null; alt?: string | null })
      : null

  return (
    <Link
      href={href}
      className="group rounded-2xl overflow-hidden border border-border hover:border-primary transition-colors bg-background flex flex-col"
    >
      <div className="relative h-52 overflow-hidden bg-sidebar-accent shrink-0">
        {img?.url ? (
          <Image
            src={img.url}
            alt={img.alt ?? ''}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : null}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
            inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {inStock ? t('inStock') : t('outOfStock')}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        {sku && (
          <p className="text-xs text-muted-foreground mb-1">
            {t('sku')}: <span className="font-mono">{sku}</span>
          </p>
        )}
        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 flex-1 font-sans">
          {title}
        </h3>
        {shortDescription && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{shortDescription}</p>
        )}
        {(priceOnRequest || price != null) && (
          <p className="mt-3 text-base font-bold text-primary">
            {priceOnRequest
              ? t('priceOnRequest')
              : `${formatPrice(price as number)} ${currency ?? 'UZS'}`}
          </p>
        )}
      </div>
    </Link>
  )
}
