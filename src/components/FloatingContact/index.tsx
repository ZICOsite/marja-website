import { getCachedGlobal } from '@/utilities/getGlobals'
import { Phone } from 'lucide-react'
import type { ContactInfo } from '@/payload-types'

type Props = {
  locale: string
}

const TELEGRAM_URL = 'https://t.me/uz_marja'

// Плавающий блок контактов в правом нижнем углу: Telegram + звонок.
// Телефон подхватывается из глобала ContactInfo (первый номер).
export const FloatingContact = async ({ locale }: Props) => {
  const data = (await getCachedGlobal('contact-info', 0, locale)()) as ContactInfo

  const phoneNumber = data?.phones?.[0]?.number
  const telHref = phoneNumber ? `tel:${phoneNumber.replace(/[^+\d]/g, '')}` : null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#229ED9]"
      >
        {/* Иконка Telegram (бренд) */}
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M21.94 4.6 18.9 19.04c-.23 1.01-.83 1.26-1.68.78l-4.64-3.42-2.24 2.15c-.25.25-.46.46-.94.46l.33-4.73 8.6-7.77c.37-.33-.08-.52-.58-.18L7.13 13.2l-4.57-1.43c-.99-.31-1.01-.99.21-1.47l17.85-6.88c.83-.3 1.55.2 1.32 1.18Z" />
        </svg>
      </a>

      {telHref && (
        <a
          href={telHref}
          aria-label={phoneNumber ?? 'Позвонить'}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          <Phone className="h-6 w-6" />
        </a>
      )}
    </div>
  )
}
