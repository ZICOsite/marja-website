'use client'

import { usePathname, useRouter } from '@/navigation'
import { useLocale } from 'next-intl'
import { locales, type Locale } from '@/i18n/routing'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Globe } from 'lucide-react'

const localeLabels: Record<Locale, string> = {
  uz: "O'zbek",
  ru: 'Русский',
  en: 'English',
  tg: 'Тоҷикӣ',
  kk: 'Қазақша',
}

export function LocaleSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-[130px] h-8 text-xs gap-1">
        <Globe className="w-3.5 h-3.5 shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((l) => (
          <SelectItem key={l} value={l} className="text-xs">
            {localeLabels[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
