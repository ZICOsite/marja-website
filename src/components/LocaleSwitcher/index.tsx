'use client'

import { usePathname, useRouter } from '@/navigation'
import { useLocale } from 'next-intl'
import { locales, type Locale } from '@/i18n/routing'

const localeLabels: Record<Locale, string> = {
  uz: "O'z",
  ru: 'Ру',
  en: 'En',
  tg: 'Тҷ',
  kk: 'Қз',
}

export function LocaleSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => handleChange(l)}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            l === locale
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-label={`Switch to ${l}`}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  )
}
