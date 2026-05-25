'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, LayoutGrid, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

export type CatNode = {
  id: string
  title: string
  slug: string
  breadcrumbUrl: string // e.g. "/roofing/metal-tiles"
  children: CatNode[]
}

type Props = {
  tree: CatNode[]
  locale: string
  currentPath: string[] // e.g. ['roofing', 'metal-tiles']
}

export const CategorySidebar: React.FC<Props> = ({ tree, locale, currentPath }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations('products')

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 border border-border rounded-xl mb-4 text-sm font-medium bg-background"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" />
          {t('categories')}
        </span>
        {mobileOpen ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <aside
        className={`${mobileOpen ? 'block' : 'hidden'} lg:block w-full`}
      >
        <div className="rounded-2xl border border-border bg-background overflow-hidden sticky top-24">
          <div className="px-4 py-3 border-b border-border bg-sidebar-accent/40">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              {t('categories')}
            </h3>
          </div>

          <nav className="p-3 space-y-0.5">
            {/* Ссылка на все товары */}
            <Link
              href={`/${locale}/products`}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${currentPath.length === 0
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                }`}
            >
              {t('allCategories')}
            </Link>

            {tree.map((node) => (
              <CategoryNode
                key={node.id}
                node={node}
                locale={locale}
                currentPath={currentPath}
                depth={0}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}

function CategoryNode({
  node,
  locale,
  currentPath,
  depth,
}: {
  node: CatNode
  locale: string
  currentPath: string[]
  depth: number
}) {
  const t = useTranslations('products')
  const nodeSlugs = node.breadcrumbUrl.split('/').filter(Boolean)
  const isInPath = nodeSlugs.length <= currentPath.length && nodeSlugs.every((s, i) => currentPath[i] === s)
  const isActive = nodeSlugs.length === currentPath.length && isInPath

  const [expanded, setExpanded] = useState(isInPath)
  const hasChildren = node.children.length > 0

  return (
    <div>
      <div
        className={`flex items-center gap-1 rounded-lg transition-colors ${isActive
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-sidebar-accent'
          }`}
      >
        <Link
          href={`/${locale}/products${node.breadcrumbUrl}`}
          className={`flex-1 px-3 py-2 text-sm ${isActive ? 'font-semibold' : ''}`}
          style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}
        >
          {node.title}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="pr-3 py-2 text-muted-foreground hover:text-foreground"
            aria-label={expanded ? t('collapse') : t('expand')}
          >
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="ml-2 border-l border-border pl-1 space-y-0.5 mt-0.5">
          {node.children.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              locale={locale}
              currentPath={currentPath}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
