import type { Metadata } from 'next/types'
import type { Locale } from '@/i18n/routing'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import React from 'react'
import PageClient from './page.client'
import { ProjectCard } from './ProjectCard'
import { buildAlternates } from '@/utilities/generateMeta'
import { BrandGraphic } from '@/components/BrandGraphic'

// ISR: сбрасывается хуком revalidateProject при изменении объекта.
export const revalidate = 3600

type Args = {
  params: Promise<{ slug: string }>
}

export default async function ProjectsPage({ params }: Args) {
  const { slug: locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'projects' })

  const payload = await getPayload({ config: configPromise })

  const projects = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    locale: locale as Locale,
    sort: 'order',
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      {/* Брендбук п. 5: силуэт здания встаёт из-за заголовка */}
      <div className="container relative mb-12">
        <BrandGraphic
          variant="building-full"
          className="bottom-0 left-1/2 h-48 -translate-x-1/2 text-marja-navy/6"
        />
        <h1 className="relative text-4xl md:text-5xl font-bold font-heading text-center">{t('title')}</h1>
      </div>

      <div className="container">
        {projects.docs.length === 0 ? (
          <p className="text-muted-foreground">{t('noProjects')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.docs.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug: locale } = await params
  const t = await getTranslations({ locale, namespace: 'projects' })
  return { title: t('title'), alternates: buildAlternates(locale, '/projects') }
}
