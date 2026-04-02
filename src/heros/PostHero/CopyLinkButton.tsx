'use client'
import React, { useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const CopyLinkButton: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const t = useTranslations('post')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = window.location.href
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      aria-label={t('copyLink')}
      type="button"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500 shrink-0" />
      ) : (
        <Link2 className="w-4 h-4 shrink-0" />
      )}
      <span className="hidden sm:inline">
        {copied ? t('linkCopied') : t('copyLink')}
      </span>
    </button>
  )
}
