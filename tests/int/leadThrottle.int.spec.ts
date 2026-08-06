import { describe, it, expect, beforeEach, vi } from 'vitest'

const telegram = vi.fn(async () => {})
const crm = vi.fn(async () => {})
let clientIp = '10.0.0.1'

vi.mock('@/services/notifications/telegram', () => ({ sendTelegramNotification: telegram }))
vi.mock('@/services/notifications/crm', () => ({ sendToCRM: crm }))
vi.mock('next/headers', () => ({
  headers: async () => ({ get: (name: string) => (name === 'x-forwarded-for' ? clientIp : null) }),
}))
// Здесь проверяется только антиспам, поэтому запись в БД подменяем, но каналы
// по-прежнему вызываем — иначе счётчики отправок ниже перестали бы что-то значить.
// Сама запись заявок покрыта в leads.int.spec.ts.
// Цены калькулятор берёт из каталога через Payload и кеш Next — в этом тесте
// суммы не проверяются, поэтому источник цен подменяем фиксированной картой.
vi.mock('@/blocks/Calculator/prices', () => ({
  fetchCatalogPrices: vi.fn(async () => ({ roofizolTkp: 200_000, primerUniversal: 11_500 })),
}))
vi.mock('@/services/leads', () => ({
  recordLead: vi.fn(async () => 1),
  deliverLead: vi.fn(
    async (
      _id: unknown,
      send: { telegram: () => Promise<unknown>; crm: () => Promise<unknown> },
    ) => {
      await Promise.all([send.telegram(), send.crm()])
    },
  ),
}))

const { submitCalculatorRequest } = await import('@/actions/submitCalculatorRequest')
const { submitConsultationRequest } = await import('@/actions/submitConsultationRequest')
const { resetRateLimit, RATE_LIMIT } = await import('@/services/rateLimit')
const { DEFAULT_INPUT } = await import('@/blocks/Calculator/calc')

const calcLead = (phone: string, area = 500) =>
  submitCalculatorRequest({
    contact: { name: 'Клиент', phone },
    calc: { ...DEFAULT_INPUT, area },
    locale: 'ru',
  })

describe('Защита заявок от спама', () => {
  beforeEach(() => {
    resetRateLimit()
    telegram.mockClear()
    crm.mockClear()
    clientIp = '10.0.0.1'
  })

  it('калькулятор: с одного IP уходит не больше порога', async () => {
    // разные телефоны, чтобы сработал именно лимит по IP, а не защита от дублей
    for (let i = 0; i < RATE_LIMIT.limit; i++) {
      expect(await calcLead(`+99890000000${i}`)).toEqual({ ok: true })
    }

    // сверх порога человек получает честный ответ, а не ложное «спасибо»
    for (let i = 0; i < 3; i++) {
      expect(await calcLead(`+99891100000${i}`)).toEqual({ ok: false, reason: 'rateLimited' })
    }

    expect(telegram).toHaveBeenCalledTimes(RATE_LIMIT.limit)
    expect(crm).toHaveBeenCalledTimes(RATE_LIMIT.limit)
  })

  it('honeypot и дубли, наоборот, отвечают «спасибо» без причины', async () => {
    const spam = await submitCalculatorRequest({
      contact: { name: 'Bot', phone: '+998900000000', website: 'http://spam' },
      calc: DEFAULT_INPUT,
    })
    expect(spam).toEqual({ ok: true })

    await calcLead('+998905555555')
    expect(await calcLead('+998905555555')).toEqual({ ok: true })
    expect(telegram).toHaveBeenCalledTimes(1)
  })

  it('калькулятор: повтор той же заявки не уходит второй раз', async () => {
    await calcLead('+998901234567')
    await calcLead('+998901234567')

    expect(telegram).toHaveBeenCalledTimes(1)
  })

  it('калькулятор: дубли не расходуют лимит', async () => {
    // столько же дублей, сколько весь лимит — и всё равно после них проходят новые заявки
    for (let i = 0; i < RATE_LIMIT.limit + 2; i++) await calcLead('+998901234567', 500)
    expect(telegram).toHaveBeenCalledTimes(1)

    for (let i = 0; i < RATE_LIMIT.limit - 1; i++) await calcLead(`+99895000000${i}`)
    expect(telegram).toHaveBeenCalledTimes(RATE_LIMIT.limit)
  })

  it('калькулятор: изменил площадь — это новая заявка', async () => {
    await calcLead('+998901234567', 500)
    await calcLead('+998901234567', 900)

    expect(telegram).toHaveBeenCalledTimes(2)
  })

  it('калькулятор: honeypot не шлёт ничего', async () => {
    const res = await submitCalculatorRequest({
      contact: { name: 'Bot', phone: '+998900000000', website: 'http://spam' },
      calc: DEFAULT_INPUT,
    })

    expect(res.ok).toBe(true)
    expect(telegram).not.toHaveBeenCalled()
  })

  it('консультация: honeypot и лимит по IP работают', async () => {
    const spam = await submitConsultationRequest({
      name: 'Bot',
      phone: '+998900000000',
      website: 'http://spam',
    })
    expect(spam.ok).toBe(true)
    expect(telegram).not.toHaveBeenCalled()

    for (let i = 0; i < RATE_LIMIT.limit + 2; i++) {
      await submitConsultationRequest({ name: 'Клиент', phone: `+99891000000${i}` })
    }
    expect(telegram).toHaveBeenCalledTimes(RATE_LIMIT.limit)
  })

  it('лимит у разных IP свой', async () => {
    for (let i = 0; i < RATE_LIMIT.limit; i++) await calcLead(`+99890000000${i}`)
    expect(telegram).toHaveBeenCalledTimes(RATE_LIMIT.limit)

    clientIp = '10.0.0.2'
    await calcLead('+998999999999')
    expect(telegram).toHaveBeenCalledTimes(RATE_LIMIT.limit + 1)
  })

  it('без заголовка с IP заявки не режутся', async () => {
    clientIp = ''
    for (let i = 0; i < RATE_LIMIT.limit + 4; i++) await calcLead(`+99893000000${i}`)

    expect(telegram).toHaveBeenCalledTimes(RATE_LIMIT.limit + 4)
  })
})
