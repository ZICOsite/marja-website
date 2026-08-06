import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * Смысл коллекции Leads — заявка не должна пропадать, если Telegram или CRM
 * недоступны, и при этом сама запись в БД не должна становиться новой причиной
 * потери. Тесты проверяют ровно это: порядок, устойчивость и итоговый статус.
 */

type CreateArgs = { collection: string; data: Record<string, unknown> }
type UpdateArgs = { collection: string; id: unknown; data: Record<string, unknown> }

const created: CreateArgs[] = []
const updated: UpdateArgs[] = []
/** Порядок вызовов: запись в БД обязана произойти раньше отправки. */
const order: string[] = []

let failCreate = false
let failUpdate = false

const create = vi.fn(async (args: CreateArgs) => {
  order.push('create')
  if (failCreate) throw new Error('DB is down')
  created.push(args)
  return { id: 42 }
})

const update = vi.fn(async (args: UpdateArgs) => {
  order.push('update')
  if (failUpdate) throw new Error('DB is down')
  updated.push(args)
  return { id: args.id }
})

vi.mock('payload', () => ({ getPayload: async () => ({ create, update }) }))
vi.mock('@payload-config', () => ({ default: {} }))

let telegramStatus: 'sent' | 'failed' | 'skipped' = 'sent'
let crmStatus: 'sent' | 'failed' | 'skipped' = 'sent'
let telegramThrows = false

const telegram = vi.fn(async () => {
  order.push('telegram')
  if (telegramThrows) throw new Error('boom')
  return telegramStatus
})
const crm = vi.fn(async () => {
  order.push('crm')
  return crmStatus
})

vi.mock('@/services/notifications/telegram', () => ({ sendTelegramNotification: telegram }))
vi.mock('@/services/notifications/crm', () => ({ sendToCRM: crm }))
vi.mock('next/headers', () => ({
  headers: async () => ({ get: (name: string) => (name === 'x-forwarded-for' ? '10.0.0.7' : null) }),
}))
// Здесь проверяется запись заявки, а не цены: реальный источник ходит в каталог
// через Payload, поэтому подменяем его фиксированной картой. Пересчёт каталожных
// цен покрыт в calculator.int.spec.ts.
vi.mock('@/blocks/Calculator/prices', () => ({
  fetchCatalogPrices: vi.fn(async () => ({ roofizolTkp: 200_000, primerUniversal: 11_500 })),
}))

const { recordLead, deliverLead, markLeadDelivery } = await import('@/services/leads')
const { submitCalculatorRequest } = await import('@/actions/submitCalculatorRequest')
const { submitConsultationRequest } = await import('@/actions/submitConsultationRequest')
const { submitProductOrder } = await import('@/actions/submitProductOrder')
const { resetRateLimit } = await import('@/services/rateLimit')
const { DEFAULT_INPUT } = await import('@/blocks/Calculator/calc')

const lastCreated = () => created[created.length - 1]!.data
const lastUpdated = () => updated[updated.length - 1]!.data

// Сброс общий на весь файл: флаги отказа БД легко протекают между блоками
// и тогда «create не вызвался» выглядит как сломанный экшен.
beforeEach(() => {
  created.length = 0
  updated.length = 0
  order.length = 0
  failCreate = false
  failUpdate = false
  telegramStatus = 'sent'
  crmStatus = 'sent'
  telegramThrows = false
  create.mockClear()
  update.mockClear()
  telegram.mockClear()
  crm.mockClear()
  resetRateLimit()
})

describe('Запись заявок в БД', () => {
  it('заявка сохраняется до отправки, а не после', async () => {
    await submitConsultationRequest({ name: 'Клиент', phone: '+998901111111' })

    expect(order.indexOf('create')).toBe(0)
    expect(order.indexOf('create')).toBeLessThan(order.indexOf('telegram'))
    // отметка о доставке — последней, когда результат уже известен
    expect(order[order.length - 1]).toBe('update')
  })

  it('недоступная БД не мешает заявке уйти менеджерам', async () => {
    failCreate = true

    const res = await submitConsultationRequest({ name: 'Клиент', phone: '+998902222222' })

    expect(res).toEqual({ ok: true })
    expect(telegram).toHaveBeenCalledTimes(1)
    expect(crm).toHaveBeenCalledTimes(1)
    // отмечать доставку нечему — обновления не было
    expect(update).not.toHaveBeenCalled()
  })

  it('упавшая отметка о доставке не ломает заявку', async () => {
    failUpdate = true

    const res = await submitConsultationRequest({ name: 'Клиент', phone: '+998903333333' })

    expect(res).toEqual({ ok: true })
    expect(telegram).toHaveBeenCalledTimes(1)
  })

  it('заявка пишется со статусом pending, пока каналы не ответили', async () => {
    await recordLead({
      source: 'consultation',
      name: 'Клиент',
      phone: '+998904444444',
      details: [{ field: 'Имя', value: 'Клиент' }],
    })

    expect(lastCreated()).toMatchObject({
      source: 'consultation',
      deliveryStatus: 'pending',
      telegramStatus: 'pending',
      crmStatus: 'pending',
    })
  })

  it('пустые поля в архив не попадают, переносы строк срезаются', async () => {
    await recordLead({
      source: 'order',
      name: 'Клиент',
      phone: '+998905555555',
      details: [
        { field: 'Имя', value: 'Клиент' },
        { field: 'Город', value: '' },
        { field: 'Товары', value: '\n1. Roofizol ТКП' },
      ],
    })

    expect(lastCreated().details).toEqual([
      { label: 'Имя', value: 'Клиент' },
      { label: 'Товары', value: '1. Roofizol ТКП' },
    ])
  })

  it('сбой записи возвращает null, а не исключение', async () => {
    failCreate = true

    await expect(
      recordLead({ source: 'consultation', name: 'Клиент', phone: '+998906666666', details: [] }),
    ).resolves.toBeNull()
  })
})

describe('Итоговый статус доставки', () => {
  const deliver = async (tg: typeof telegramStatus, crmResult: typeof crmStatus) => {
    telegramStatus = tg
    crmStatus = crmResult
    await deliverLead(42, { telegram: () => telegram(), crm: () => crm() })
    return lastUpdated()
  }

  it('оба канала дошли — доставлено', async () => {
    expect(await deliver('sent', 'sent')).toMatchObject({ deliveryStatus: 'delivered' })
  })

  it('один канал упал — частично', async () => {
    expect(await deliver('sent', 'failed')).toMatchObject({
      deliveryStatus: 'partial',
      telegramStatus: 'sent',
      crmStatus: 'failed',
    })
  })

  it('оба канала упали — не доставлено', async () => {
    expect(await deliver('failed', 'failed')).toMatchObject({ deliveryStatus: 'failed' })
  })

  it('ненастроенный канал не портит статус', async () => {
    expect(await deliver('sent', 'skipped')).toMatchObject({ deliveryStatus: 'delivered' })
  })

  it('если не настроен ни один канал — заявка не доставлена', async () => {
    // забытые переменные окружения на проде должны быть видны как потерянный лид
    expect(await deliver('skipped', 'skipped')).toMatchObject({ deliveryStatus: 'failed' })
  })

  it('неожидаемое исключение в канале считается неудачей, второй канал всё равно шлётся', async () => {
    telegramThrows = true
    crmStatus = 'sent'

    await deliverLead(42, { telegram: () => telegram(), crm: () => crm() })

    expect(lastUpdated()).toMatchObject({
      deliveryStatus: 'partial',
      telegramStatus: 'failed',
      crmStatus: 'sent',
    })
  })

  it('без сохранённой заявки отметка просто пропускается', async () => {
    await markLeadDelivery(null, { telegram: 'sent', crm: 'sent' })

    expect(update).not.toHaveBeenCalled()
  })
})

describe('Данные заявок по формам', () => {
  it('калькулятор сохраняет площадь, сумму и срок закупки', async () => {
    await submitCalculatorRequest({
      contact: {
        name: 'Клиент',
        phone: '+998907777777',
        city: 'Ташкент',
        timing: 'month',
        comment: 'Нужен расчёт',
      },
      calc: { ...DEFAULT_INPUT, area: 750 },
      locale: 'ru',
    })

    const data = lastCreated()
    expect(data).toMatchObject({
      source: 'calculator',
      city: 'Ташкент',
      timing: 'month',
      comment: 'Нужен расчёт',
      locale: 'ru',
      area: 750,
      ip: '10.0.0.7',
    })
    expect(data.amount).toBeGreaterThan(0)
  })

  it('подставленный срок закупки в БД не попадает', async () => {
    await submitCalculatorRequest({
      contact: {
        name: 'Клиент',
        phone: '+998908888888',
        // клиент может отправить что угодно — в select такое значение писать нельзя
        timing: 'вчера' as never,
      },
      calc: DEFAULT_INPUT,
    })

    expect(lastCreated().timing).toBeUndefined()
  })

  it('заказ товара сохраняет список товаров', async () => {
    await submitProductOrder({
      name: 'Клиент',
      phone: '+998909999999',
      items: [{ title: 'Roofizol ТКП', sku: 'RF-1' }],
    })

    const data = lastCreated()
    expect(data.source).toBe('order')
    expect(JSON.stringify(data.details)).toContain('Roofizol ТКП')
  })

  it('спам и дубли в БД не пишутся', async () => {
    await submitConsultationRequest({
      name: 'Bot',
      phone: '+998900000000',
      website: 'http://spam',
    })
    expect(create).not.toHaveBeenCalled()

    await submitConsultationRequest({ name: 'Клиент', phone: '+998901234567' })
    await submitConsultationRequest({ name: 'Клиент', phone: '+998901234567' })
    expect(create).toHaveBeenCalledTimes(1)
  })
})
