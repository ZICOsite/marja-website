'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import React, { useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'

const icons: Record<string, React.ReactNode> = {
  auto: <Monitor className="w-4 h-4" />,
  light: <Sun className="w-4 h-4" />,
  dark: <Moon className="w-4 h-4" />,
}

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState('auto')
  const t = useTranslations('nav')

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setValue('auto')
    } else {
      setTheme(themeToSet)
      setValue(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(preference ?? 'auto')
  }, [])

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger
        aria-label={t('selectTheme')}
        className="w-auto bg-transparent border-none focus:ring-0 [&>svg:last-child]:hidden"
      >
        {icons[value] ?? <Monitor className="w-4 h-4" />}
      </SelectTrigger>
      <SelectContent className="min-w-0 w-18">
        <SelectItem value="auto">
          <Monitor className="w-4 h-4" /><span className="sr-only">Auto</span>
        </SelectItem>
        <SelectItem value="light">
          <Sun className="w-4 h-4" /><span className="sr-only">Light</span>
        </SelectItem>
        <SelectItem value="dark">
          <Moon className="w-4 h-4" /><span className="sr-only">Dark</span>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
