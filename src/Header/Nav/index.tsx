'use client'

import React, { useState } from 'react'

import type { Header as HeaderType, ProductCategory } from '@/payload-types'

import Link from 'next/link'
import { SearchIcon, Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from '@/components/Logo/Logo'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

interface MenuItem {
  title: string
  url: string
  description?: string
  icon?: React.ReactNode
  items?: MenuItem[]
}

interface NavbarProps {
  className?: string
  menu: MenuItem[]
}

const Navbar = ({ menu, className }: NavbarProps) => {
  const [open, setOpen] = useState(false)
  const closeMenu = () => setOpen(false)

  return (
    <section className={className}>
      <div>
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>{menu.map((item) => renderMenuItem(item))}</NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 py-4">
                  <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
                    {menu.map((item) => renderMobileMenuItem(item, closeMenu))}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  )
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground font-sans"
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const renderMobileMenuItem = (item: MenuItem, onClose: () => void) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} onClose={onClose} />
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold font-sans" onClick={onClose}>
      {item.title}
    </Link>
  )
}

const SubMenuLink = ({ item, onClose = () => { } }: { item: MenuItem; onClose?: () => void }) => {
  return (
    <Link
      className="flex min-w-80 flex-row gap-4 rounded-md py-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
      onClick={onClose}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">{item.description}</p>
        )}
      </div>
    </Link>
  )
}

type NavLink = NonNullable<NonNullable<HeaderType['navItems']>[number]['link']>

function buildHref(link: NavLink | null | undefined, locale: string): string {
  if (
    link?.type === 'reference' &&
    typeof link.reference?.value === 'object' &&
    link.reference?.value &&
    'slug' in link.reference.value &&
    link.reference.value.slug
  ) {
    const prefix = `/${locale}`
    const collectionPrefix =
      link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''
    return `${prefix}${collectionPrefix}/${link.reference.value.slug}`
  }
  const url = link?.url || '#'
  if (url.startsWith('/') && !url.startsWith(`/${locale}/`) && url !== `/${locale}`) {
    return `/${locale}${url}`
  }
  return url
}

export const HeaderNav: React.FC<{
  data: HeaderType
  locale: string
  categories: ProductCategory[]
}> = ({ data, locale, categories }) => {
  const navItems = data?.navItems || []
  const t = useTranslations('nav')

  const catalogItem: MenuItem | null =
    categories.length > 0
      ? {
        title: t('catalog'),
        url: `/${locale}/products`,
        items: [
          { title: t('allCategories'), url: `/${locale}/products` },
          ...categories.map((cat) => ({
            title: cat.title || '',
            url: `/${locale}/products/${cat.slug}`,
          })),
        ],
      }
      : null

  const menu: MenuItem[] = [
    ...(catalogItem ? [catalogItem] : []),
    ...navItems.map((item) => ({
      title: item.link?.label || '',
      url: buildHref(item.link, locale),
      items: item.subLinks?.length
        ? item.subLinks.map((sub) => ({
          title: sub.link?.label || '',
          url: buildHref(sub.link, locale),
          description: sub.description || undefined,
        }))
        : undefined,
    })),
  ]

  return (
    <nav className="flex gap-3 items-center">
      <Navbar menu={menu} />
      <ThemeSelector />
      <Link href={`/${locale}/search`}>
        <span className="sr-only">{t('search')}</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
