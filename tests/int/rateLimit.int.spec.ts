import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

import {
  allowRequest,
  isDuplicate,
  resetRateLimit,
  RATE_LIMIT,
  DEDUPE_WINDOW_MS,
} from '@/services/rateLimit'

describe('Ограничение частоты заявок', () => {
  beforeEach(() => {
    resetRateLimit()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('пропускает заявки до порога и режет следующие', () => {
    for (let i = 0; i < RATE_LIMIT.limit; i++) {
      expect(allowRequest('calculator', '1.2.3.4')).toBe(true)
    }
    expect(allowRequest('calculator', '1.2.3.4')).toBe(false)
    expect(allowRequest('calculator', '1.2.3.4')).toBe(false)
  })

  it('считает лимит отдельно для каждого IP и каждой формы', () => {
    for (let i = 0; i < RATE_LIMIT.limit; i++) allowRequest('calculator', '1.2.3.4')

    expect(allowRequest('calculator', '5.6.7.8')).toBe(true)
    expect(allowRequest('consultation', '1.2.3.4')).toBe(true)
  })

  it('снова пропускает после того, как окно прошло', () => {
    for (let i = 0; i < RATE_LIMIT.limit; i++) allowRequest('calculator', '1.2.3.4')
    expect(allowRequest('calculator', '1.2.3.4')).toBe(false)

    vi.advanceTimersByTime(RATE_LIMIT.windowMs + 1000)
    expect(allowRequest('calculator', '1.2.3.4')).toBe(true)
  })

  it('заблокированные попытки не продлевают блокировку', () => {
    const base = new Date('2026-07-29T10:00:00Z').getTime()
    vi.setSystemTime(base)
    for (let i = 0; i < RATE_LIMIT.limit; i++) allowRequest('calculator', '1.2.3.4')

    // клиент нетерпеливо жмёт кнопку весь период ожидания
    for (const part of [0.25, 0.5, 0.75, 0.99]) {
      vi.setSystemTime(base + RATE_LIMIT.windowMs * part)
      expect(allowRequest('calculator', '1.2.3.4')).toBe(false)
    }

    // окно всё равно отсчитывается от отправленных заявок, а не от последнего клика
    vi.setSystemTime(base + RATE_LIMIT.windowMs + 1000)
    expect(allowRequest('calculator', '1.2.3.4')).toBe(true)
  })

  it('не ограничивает, когда IP неизвестен — живой лид важнее', () => {
    for (let i = 0; i < RATE_LIMIT.limit * 5; i++) {
      expect(allowRequest('calculator', 'unknown')).toBe(true)
    }
  })

  it('ловит повтор той же заявки и пропускает после окна', () => {
    expect(isDuplicate('calculator:+998901234567:500')).toBe(false)
    expect(isDuplicate('calculator:+998901234567:500')).toBe(true)

    vi.advanceTimersByTime(DEDUPE_WINDOW_MS + 1000)
    expect(isDuplicate('calculator:+998901234567:500')).toBe(false)
  })

  it('разные заявки дублями не считает', () => {
    expect(isDuplicate('calculator:+998901234567:500')).toBe(false)
    expect(isDuplicate('calculator:+998901234567:800')).toBe(false)
    expect(isDuplicate('calculator:+998900000000:500')).toBe(false)
  })
})
