'use client'

import React, { useState } from 'react'
import { Loader2, Check } from 'lucide-react'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { submitProductOrder, type OrderProduct } from '@/actions/submitProductOrder'
import { trackLead } from '@/utilities/trackLead'

type Props = {
  items: OrderProduct[]
  /** Element that opens the dialog (e.g. a Button). */
  trigger: React.ReactNode
  /** Called after a successful submission (e.g. to clear the cart). */
  onSuccess?: () => void
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export const OrderDialog: React.FC<Props> = ({ items, trigger, onSuccess }) => {
  const t = useTranslations('order')
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setStatus('idle')
      setName('')
      setPhone('')
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || status === 'submitting' || items.length === 0) return

    setStatus('submitting')
    const res = await submitProductOrder({ name, phone, items })
    if (res.ok) {
      setStatus('success')
      trackLead('product_order', { items: items.length })
      onSuccess?.()
    } else {
      setStatus('error')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

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
            <div className="rounded-md bg-muted px-3 py-2 text-sm">
              <p className="text-muted-foreground mb-1">
                {items.length > 1 ? t('products') : t('product')}:
              </p>
              <ul className="space-y-0.5">
                {items.map((it, i) => (
                  <li key={i} className="font-medium line-clamp-1">
                    {it.title}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="order-name">{t('name')}</Label>
              <Input
                id="order-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                autoComplete="name"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="order-phone">{t('phone')}</Label>
              <Input
                id="order-phone"
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
  )
}
