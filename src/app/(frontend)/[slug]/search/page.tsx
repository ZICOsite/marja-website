import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'

type Args = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function Page({ params, searchParams: searchParamsPromise }: Args) {
  const { slug: locale } = await params
  const { q: query } = await searchParamsPromise

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'search' })
  const tProducts = await getTranslations({ locale, namespace: 'products' })

  const payload = await getPayload({ config: configPromise })

  // --- Поиск по постам (через searchPlugin) ---
  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 6,
    locale: locale as any,
    select: { title: true, slug: true, categories: true, meta: true },
    pagination: false,
    where: {
      and: [
        { 'doc.relationTo': { equals: 'posts' } },
        ...(query
          ? [
              {
                or: [
                  { title: { like: query } },
                  { 'meta.description': { like: query } },
                  { 'meta.title': { like: query } },
                  { slug: { like: query } },
                ],
              },
            ]
          : []),
      ],
    },
  })

  // --- Поиск по товарам (через searchPlugin) ---
  const products = query
    ? await payload.find({
        collection: 'search',
        depth: 1,
        limit: 12,
        locale: locale as any,
        pagination: false,
        where: {
          and: [
            { 'doc.relationTo': { equals: 'products' } },
            {
              or: [
                { title: { like: query } },
                { sku: { like: query } },
                { shortDescription: { like: query } },
              ],
            },
          ],
        },
      })
    : null

  const hasResults = posts.totalDocs > 0 || (products?.totalDocs ?? 0) > 0

  return (
    <div className="pt-24 pb-24">
      <PageClient />

      {/* Шапка с поиском */}
      <div className="container mb-12">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-10">{t('title')}</h1>
          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {/* Нет результатов */}
      {query && !hasResults && (
        <div className="container text-center text-muted-foreground py-8">{t('noResults')}</div>
      )}

      {/* Результаты: товары */}
      {(products?.totalDocs ?? 0) > 0 && (
        <div className="container mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-heading">
              {tProducts('catalog')}
              <span className="ml-3 text-base font-normal text-muted-foreground">
                {products!.totalDocs}
              </span>
            </h2>
            <Link
              href={`/${locale}/products`}
              className="text-sm text-primary hover:underline font-medium"
            >
              {tProducts('allCategories')} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products!.docs.map((product) => {
              const img =
                typeof product.heroImage === 'object' && product.heroImage !== null
                  ? product.heroImage
                  : null

              return (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.slug}`}
                  className="group rounded-2xl overflow-hidden border border-border hover:border-primary transition-colors bg-background flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden bg-sidebar-accent shrink-0">
                    {img && 'url' in img && img.url ? (
                      <Image
                        src={img.url as string}
                        alt={'alt' in img && img.alt ? (img.alt as string) : ''}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : null}
                    <span
                      className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.inStock ? tProducts('inStock') : tProducts('outOfStock')}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    {product.sku && (
                      <p className="text-xs text-muted-foreground font-mono mb-1">{product.sku}</p>
                    )}
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Результаты: посты */}
      {posts.totalDocs > 0 && (
        <div className="container">
          <h2 className="text-2xl font-bold font-heading mb-6">
            {t('postsTitle')}
            <span className="ml-3 text-base font-normal text-muted-foreground">
              {posts.totalDocs}
            </span>
          </h2>
          <CollectionArchive posts={posts.docs as CardPostData[]} />
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return { title: 'Search' }
}
