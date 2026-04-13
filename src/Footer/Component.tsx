import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import './style.css'

import { Mail, MapPin, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import type { ContactInfo, Footer } from '@/payload-types'

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
  const t = await getTranslations({ locale, namespace: 'footer' })

  const navItems = footerData?.navItems || []
  const companyLinks = footerData?.companyLinks || []
  const productLinks = footerData?.productLinks || []

  return (
    <footer className="footer mt-auto border-t border-border bg-accent text-accent-foreground dark:bg-card">
      <div className="container py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="footer__col">
          <Logo />
          {footerData?.description && (
            <p className="footer__col-txt text-balance">{footerData.description}</p>
          )}
        </div>
        {companyLinks.length > 0 && (
          <div className="footer__col">
            <h3 className="footer__col-title">{t('company')}</h3>
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
            <h3 className="footer__col-title">{t('products')}</h3>
            <ul className="footer__col-list">
              {productLinks.map(({ link }, i) => (
                <li key={i} className="footer__col-item">
                  <CMSLink {...link} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        )}
        {(contactData?.addresses?.length || contactData?.phones?.length || contactData?.email) && (
          <div className="footer__col">
            <h3 className="footer__col-title">{t('contacts')}</h3>
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
        )}
      </div>
      <div className="footer__bottom py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">{t('copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {footerData?.privacyPolicy && (
              <Dialog>
                <DialogTrigger asChild>
                  <span className="cursor-pointer text-sm">{t('privacyPolicy')}</span>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('privacyPolicy')}</DialogTitle>
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
                  <span className="cursor-pointer text-sm">{t('termsOfUse')}</span>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('termsOfUse')}</DialogTitle>
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
    </footer>
  )
}
