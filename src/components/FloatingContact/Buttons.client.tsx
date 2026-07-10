'use client'

import React, { useEffect, useState } from 'react'
import { Phone, Loader2, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { submitConsultationRequest } from '@/actions/submitConsultationRequest'

const TELEGRAM_URL = 'https://t.me/uz_marja'
const BUBBLE_DELAY_MS = 20000

type Props = {
  telHref: string | null
  phoneNumber: string | null | undefined
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export const FloatingContactButtons: React.FC<Props> = ({ telHref, phoneNumber }) => {
  const t = useTranslations('consultation')
  const [showBubble, setShowBubble] = useState(false)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), BUBBLE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setStatus('idle')
      setName('')
      setPhone('')
    }
  }

  const openDialog = () => {
    setShowBubble(false)
    setOpen(true)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || status === 'submitting') return

    setStatus('submitting')
    const res = await submitConsultationRequest({ name, phone })
    setStatus(res.ok ? 'success' : 'error')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {showBubble && (
        <button
          type="button"
          onClick={openDialog}
          className="cursor-pointer animate-in fade-in slide-in-from-bottom-2 relative flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-xl ring-1 ring-black/5 transition-transform hover:scale-105"
        >
          <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
          </span>
          {t('bubbleLabel')}
        </button>
      )}

      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#229ED9]"
      >
        {/* Иконка Telegram (бренд) */}
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
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

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          {status === 'success' ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check className="h-6 w-6" />
              </div>
              <p className="font-medium">{t('success')}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="consultation-name">{t('name')}</Label>
                <Input
                  id="consultation-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('namePlaceholder')}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="consultation-phone">{t('phone')}</Label>
                <Input
                  id="consultation-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('phonePlaceholder')}
                  autoComplete="tel"
                  required
                />
              </div>

              {status === 'error' && <p className="text-sm text-destructive">{t('error')}</p>}

              <Button type="submit" size="lg" className="gap-2" disabled={status === 'submitting'}>
                {status === 'submitting' && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === 'submitting' ? t('submitting') : t('submit')}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
