import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

// В конструкторе форм Payload нет типа «телефон»: номер заводят обычным text-полем
// («Телефон», «phone»). Узнаём его по имени/подписи, чтобы на мобильном открывалась
// цифровая клавиатура и браузер подставлял сохранённый номер.
const PHONE_RE = /phone|tel|телефон/i
const NAME_RE = /^(name|имя|ism|ном|аты)$/i

export const Text: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const isPhone = PHONE_RE.test(name) || PHONE_RE.test(label ?? '')
  const isName = NAME_RE.test(name.trim()) || NAME_RE.test((label ?? '').trim())

  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}

        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Input
        defaultValue={defaultValue}
        id={name}
        type={isPhone ? 'tel' : 'text'}
        inputMode={isPhone ? 'tel' : undefined}
        autoComplete={isPhone ? 'tel' : isName ? 'name' : undefined}
        {...register(name, { required })}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
