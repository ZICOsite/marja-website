import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { Mail, MapPin, Phone } from 'lucide-react'

import type { ContactInfo, Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import RichText from '@/components/RichText'

type Props = {
  locale: string
}

export async function Footer({ locale }: Props) {
  const footerData: Footer = await getCachedGlobal('footer', 1, locale)()
  const contactData = (await getCachedGlobal('contact-info', 0, locale)()) as ContactInfo

  const navItems = footerData?.navItems || []
  const companyLinks = footerData?.companyLinks || []
  const productLinks = footerData?.productLinks || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="footer__col">
          <Logo />
          {footerData?.description && (
            <p className="footer__col-txt text-balance">{footerData.description}</p>
          )}
        </div>
        {companyLinks.length > 0 && (
          <div className="footer__col">
            <h3 className="footer__col-title">Компания</h3>
            <ul className="footer__col-list">
              {companyLinks.map(({ link }, i) => (
                <li key={i} className="footer__col-item">
                  <CMSLink {...link} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        )}
        {productLinks.length > 0 && (
          <div className="footer__col">
            <h3 className="footer__col-title">Продукция</h3>
            <ul className="footer__col-list">
              {productLinks.map(({ link }, i) => (
                <li key={i} className="footer__col-item">
                  <CMSLink {...link} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="footer__col">
          <h3 className="footer__col-title">Контактные данные</h3>
          <ul className="footer__col-list">
            {contactData?.addresses?.map((item, i) => (
              <li key={i} className="footer__col-item">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-1.5 text-balance"
                  >
                    <MapPin className="shrink-0 mt-1" size={16} />
                    {item.label}
                  </a>
                ) : (
                  <span className="flex gap-1.5 text-balance">
                    <MapPin className="shrink-0 mt-1" size={16} />
                    {item.label}
                  </span>
                )}
              </li>
            ))}
            {contactData?.phones?.map((item, i) => (
              <li key={i} className="footer__col-item">
                <a href={`tel:${item.number}`} className="flex gap-1.5 text-balance">
                  <Phone className="shrink-0 mt-1" size={16} />
                  {item.number}
                </a>
              </li>
            ))}
            {contactData?.email && (
              <li className="footer__col-item">
                <a href={`mailto:${contactData.email}`} className="flex gap-1.5 text-balance">
                  <Mail className="shrink-0 mt-1" size={16} />
                  {contactData.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="footer__bottom py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {new Date().getFullYear()} MARJA. Все права защищены.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {footerData?.privacyPolicy && (
              <Dialog>
                <DialogTrigger asChild>
                  <span className="cursor-pointer text-sm">Политика конфиденциальности</span>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Политика конфиденциальности</DialogTitle>
                  </DialogHeader>
                  <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
                    <RichText
                      data={footerData.privacyPolicy}
                      enableGutter={false}
                      enableProse={true}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
            {footerData?.termsOfUse && (
              <Dialog>
                <DialogTrigger asChild>
                  <span className="cursor-pointer text-sm">Условия использования</span>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Условия использования</DialogTitle>
                  </DialogHeader>
                  <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
                    <RichText
                      data={footerData.termsOfUse}
                      enableGutter={false}
                      enableProse={true}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
      {/* <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href={`/${locale}`}>
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} locale={locale} />
            })}
          </nav>
        </div>
      </div> */}
    </footer>
  )
}
