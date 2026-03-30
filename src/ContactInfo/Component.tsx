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
    <div className="topBar py-4 bg-accent text-accent-foreground">
      <div className="container flex items-center justify-between flex-wrap gap-4">
        <div className="topBar__left flex items-center gap-3 text-[12px] md:text-sm flex-wrap">
          {data?.email && (
            <a href={`mailto:${data.email}`} className="flex items-center gap-1.5">
              <Mail className="shrink-0" size={16} />
              {data.email}
            </a>
          )}
          {address &&
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
          {phone && (
            <a href={`tel:${phone.number}`} className="flex items-center gap-1.5">
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
