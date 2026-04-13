import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import React from 'react'
import PageClient from './page.client'
import { ProjectCard } from './ProjectCard'

export const dynamic = 'force-static'
export const revalidate = 600

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
    locale: locale as any,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-center">{t('title')}</h1>
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
  return { title: t('title') }
}
