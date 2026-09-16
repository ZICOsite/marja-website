import type { DeliveryStatus, FormSubmission, SubmissionField } from './types'

/**
 * Прямая отправка заявок в amoCRM (API v4), без промежуточных сервисов.
 *
 * Авторизация — долгосрочным токеном внешней интеграции «Сайт marja.uz»
 * (amoCRM → amoМаркет → ··· → Создать интеграцию → вкладка «Ключи и доступы»).
 * Токен не протухает сам, поэтому refresh-цикла здесь нет: одна переменная
 * окружения, никакого хранилища токенов на сервере.
 */

const BASE_URL = process.env.AMOCRM_BASE_URL?.replace(/\/+$/, '')
const ACCESS_TOKEN = process.env.AMOCRM_ACCESS_TOKEN

/** Воронка «Абдумажид Сайт MARJA.UZ» и её первый рабочий этап «Первичный контакт». */
const PIPELINE_ID = Number(process.env.AMOCRM_PIPELINE_ID ?? 7313178)
const STATUS_ID = Number(process.env.AMOCRM_STATUS_ID ?? 60899482)

/**
 * ID полей аккаунта apponov95. Смотреть их —
 * GET /api/v4/leads/custom_fields и /api/v4/contacts/custom_fields.
 */
const FIELD = {
  contactPhone: 801877,
  leadMessage: 1764935, // «Сообщение»
  leadPage: 1764977, // «Страница»
  leadSource: 1774935, // «Откуда узнали?»
} as const

/** Вариант «Сайт» в поле «Откуда узнали?». */
const SOURCE_SITE_ENUM_ID = 1832975

/** Текстовые поля amoCRM режутся на 255 символах — длинное уходит в примечание. */
const TEXT_FIELD_LIMIT = 255

type AmoCustomField = {
  field_id: number
  values: Array<{ value?: string | number; enum_id?: number; enum_code?: string }>
}

const pick = (data: SubmissionField[], field: string): string =>
  data.find((item) => item.field === field)?.value?.trim() ?? ''

const text = (fieldId: number, value: string): AmoCustomField => ({
  field_id: fieldId,
  values: [{ value: value.slice(0, TEXT_FIELD_LIMIT) }],
})

async function amoFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
}

/**
 * Ищет контакт по телефону, чтобы повторное обращение легло к той же карточке,
 * а не плодило дубли в базе менеджеров.
 *
 * Поиск идёт по цифрам: клиент пишет номер как угодно (+998 90 123-45-67,
 * 998901234567), а amoCRM сравнивает строку как есть.
 */
async function findContactId(phone: string): Promise<number | null> {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7) return null

  try {
    const res = await amoFetch(`/api/v4/contacts?query=${encodeURIComponent(digits)}&limit=1`)
    // 204 — совпадений нет, это нормальный ответ amoCRM, а не ошибка.
    if (res.status === 204) return null
    if (!res.ok) return null

    const body = await res.json()
    const id = body?._embedded?.contacts?.[0]?.id
    return typeof id === 'number' ? id : null
  } catch {
    // Не нашли — не беда: создадим новый контакт. Ронять заявку из-за поиска нельзя.
    return null
  }
}

/** Полный снимок заявки — уходит примечанием, там нет лимита в 255 символов. */
async function addNote(leadId: number, note: string): Promise<void> {
  try {
    const res = await amoFetch(`/api/v4/leads/${leadId}/notes`, {
      method: 'POST',
      body: JSON.stringify([{ note_type: 'common', params: { text: note } }]),
    })
    if (!res.ok) console.error('[amoCRM] Примечание не добавлено:', await res.text())
  } catch (err) {
    console.error('[amoCRM] Ошибка при добавлении примечания:', err)
  }
}

export async function sendToAmoCRM(submission: FormSubmission): Promise<DeliveryStatus> {
  if (!BASE_URL || !ACCESS_TOKEN) return 'skipped'

  const data = submission.submissionData.filter(
    ({ value }) => value !== undefined && value !== null && String(value).trim() !== '',
  )

  const name = pick(data, 'Имя')
  const phone = pick(data, 'Телефон')
  const formTitle =
    typeof submission.form === 'object' && submission.form?.title
      ? submission.form.title
      : 'Заявка с сайта'

  // Без телефона менеджеру нечего делать со сделкой, а контакт в amoCRM
  // без единого способа связи — мусор в базе.
  if (!phone) return 'failed'

  const details = data.filter(({ field }) => field !== 'Имя' && field !== 'Телефон')
  const noteText = [
    formTitle,
    ...details.map(({ field, value }) => `${field}: ${String(value).trim()}`),
  ].join('\n')

  const comment = pick(data, 'Комментарий')
  const amount = Number(pick(data, 'Итого ориентировочно').replace(/\D/g, '')) || undefined

  const leadFields: AmoCustomField[] = [
    text(FIELD.leadPage, formTitle),
    { field_id: FIELD.leadSource, values: [{ enum_id: SOURCE_SITE_ENUM_ID }] },
  ]
  // «Сообщение» — то, что клиент написал сам; остальные поля читаются в примечании.
  if (comment) leadFields.unshift(text(FIELD.leadMessage, comment))

  const lead: Record<string, unknown> = {
    name: name ? `${formTitle} — ${name}` : formTitle,
    pipeline_id: PIPELINE_ID,
    status_id: STATUS_ID,
    custom_fields_values: leadFields,
  }
  if (amount) lead.price = amount

  const contactFields: AmoCustomField[] = [
    { field_id: FIELD.contactPhone, values: [{ value: phone, enum_code: 'MOB' }] },
  ]

  try {
    const contactId = await findContactId(phone)

    // Известный клиент — сделка вешается на его карточку; новый — создаётся
    // вместе с контактом одним запросом (эндпоинт /complex именно для этого).
    const path = contactId ? '/api/v4/leads' : '/api/v4/leads/complex'
    const body = contactId
      ? [{ ...lead, _embedded: { contacts: [{ id: contactId }] } }]
      : [
          {
            ...lead,
            _embedded: {
              contacts: [{ first_name: name || phone, custom_fields_values: contactFields }],
            },
          },
        ]

    const res = await amoFetch(path, { method: 'POST', body: JSON.stringify(body) })

    if (!res.ok) {
      console.error('[amoCRM] Сделка не создана:', res.status, await res.text())
      return 'failed'
    }

    const created = await res.json()
    // /complex отвечает плоским массивом, /leads — конвертом с _embedded.
    const leadId: number | undefined = Array.isArray(created)
      ? created[0]?.id
      : created?._embedded?.leads?.[0]?.id

    // Примечание уже не влияет на судьбу заявки: сделка в воронке, телефон на месте.
    if (leadId && details.length) await addNote(leadId, noteText)

    return 'sent'
  } catch (err) {
    console.error('[amoCRM] Ошибка запроса:', err)
    return 'failed'
  }
}
