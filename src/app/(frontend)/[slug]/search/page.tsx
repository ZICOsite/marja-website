import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'
import Link from 'next/link'

import { CollectionArchive } from '@/components/CollectionArchive'
import { ProductCard } from '@/components/ProductCard'
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
    select: { title: true, slug: true, categories: true, meta: true, heroImage: true },
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
            {products!.docs.map((product) => (
              <ProductCard
                key={product.id}
                href={`/${locale}/products/${product.slug}`}
                title={product.title ?? ''}
                sku={product.sku}
                inStock={product.inStock}
                heroImage={product.heroImage}
                locale={locale}
              />
            ))}
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

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug: locale } = await params
  const t = await getTranslations({ locale, namespace: 'search' })
  return { title: t('title'), robots: { index: false, follow: false } }
}
