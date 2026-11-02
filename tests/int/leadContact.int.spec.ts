import { describe, it, expect } from 'vitest'

import { isValidPhone } from '@/utilities/leadContact'

describe('isValidPhone', () => {
  it('принимает номера в любом привычном виде', () => {
    expect(isValidPhone('+998 90 123-45-67')).toBe(true)
    expect(isValidPhone('901234567')).toBe(true)
    expect(isValidPhone('(71) 200-00-00')).toBe(true)
  })

  it('отклоняет пустое, слишком короткое и слишком длинное', () => {
    expect(isValidPhone('')).toBe(false)
    expect(isValidPhone(undefined)).toBe(false)
    expect(isValidPhone('123-45')).toBe(false)
    expect(isValidPhone('1'.repeat(16))).toBe(false)
    expect(isValidPhone('+998 ' + 'x'.repeat(60))).toBe(false)
  })
})
