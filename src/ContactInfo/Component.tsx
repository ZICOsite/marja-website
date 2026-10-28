import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { Mail, MapPin, Phone } from 'lucide-react'
import type { ContactInfo } from '@/payload-types'

type Props = {
  locale: string
}

export const TopBar = async ({ locale }: Props) => {
  const data = (await getCachedGlobal('contact-info', 0, locale)()) as ContactInfo

  const phone = data?.phones?.[0]
  const address = data?.addresses?.[0]

  return (
    // Брендбук п. 4: фон navy, текст белый 80–100 %, телефон и активный язык — gold
    <div className="topBar py-4 bg-marja-navy text-marja-white">
      <div className="container flex items-center justify-between flex-wrap gap-4">
        <div className="topBar__left flex items-center gap-3 text-[12px] md:text-sm flex-wrap text-marja-white/85">
          {data?.email && (
            <a href={`mailto:${data.email}`} className="flex items-center gap-1.5 font-sans">
              <Mail className="shrink-0" size={16} />
              {data.email}
            </a>
          )}
          {address?.label &&
            (address.url ? (
              <a
                href={address.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <MapPin className="shrink-0" size={16} />
                {address.label}
              </a>
            ) : (
              <span className="flex items-center gap-1.5">
                <MapPin className="shrink-0" size={16} />
                {address.label}
              </span>
            ))}
        </div>
        <div className="topBar__right flex items-center gap-3 text-[12px] md:text-sm flex-wrap">
          {phone?.number && (
            <a href={`tel:${phone.number}`} className="flex items-center gap-1.5 text-marja-gold">
              <Phone className="shrink-0" size={16} />
              {phone.number}
            </a>
          )}
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  )
}
