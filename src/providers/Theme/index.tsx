'use client'

import React, { createContext, useCallback, use, useEffect } from 'react'

import type { ThemeContextType } from './types'

import { defaultTheme } from './shared'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: defaultTheme,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const setTheme = useCallback(() => {
    document.documentElement.setAttribute('data-theme', defaultTheme)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', defaultTheme)
  }, [])

  return <ThemeContext value={{ setTheme, theme: defaultTheme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
