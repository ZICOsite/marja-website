'use server'

import { sendTelegramNotification } from '@/services/notifications/telegram'
import { sendToCRM } from '@/services/notifications/crm'
import { deliverLead, recordLead } from '@/services/leads'
import {
  calculate,
  clampParapetHeight,
  type CalcInput,
  type ProductKey,
  type Unit,
} from '@/blocks/Calculator/calc'
import { formatPrice } from '@/utilities/formatPrice'
import { getClientIp } from '@/utilities/getClientIp'
import { allowRequest, isDuplicate } from '@/services/rateLimit'

/**
 * `rateLimited` — заявка не ушла, но это живой человек: ему показываем честное
 * «слишком часто». Honeypot и дубли, наоборот, отвечают `ok`, чтобы бот не понял,
 * на чём его поймали, а человек с двойным кликом не пугался — его заявка уже ушла.
 */
export type CalculatorResult = { ok: boolean; reason?: 'rateLimited' }

export type TimingKey = 'now' | 'month' | 'quarter'

export type CalculatorContact = {
  name: string
  phone: string
  city?: string
  comment?: string
  /** Когда планируется закупка — скоринг лида. Приходит ключом, не текстом. */
  timing?: TimingKey
  /** Honeypot: заполняется только ботами. */
  website?: string
}

export type CalculatorRequestInput = {
  contact: CalculatorContact
  calc: CalcInput
  locale?: string
}

// Менеджеры читают заявки по-русски — подписи в уведомлении всегда русские,
// независимо от локали, на которой считал клиент.
const MATERIAL_LABELS: Record<ProductKey, string> = {
  roofizolTkp: 'Roofizol ТКП',
  izomembraneEkp: 'Izomembrane ЭКП',
  roofizolTfp: 'Roofizol ТФП',
  izomembraneEfp: 'Izomembrane ЭФП',
  folgoizolTfp: 'Фольгоизол ТФП',
  folgoizolEfp: 'Фольгоизол ЭФП',
  roofizolTpp: 'Roofizol ТПП',
  izomembraneEpp: 'Izomembrane ЭПП',
  poliizolTpp: 'Полиизол ТПП',
  poliizolEpp: 'Полиизол ЭПП',
  izolTpp: 'Изол ТПП',
  gidroizolOsnova: 'Гидроизол Основа',
  gidroizolFundament: 'Гидроизол Фундамент',
  primerUniversal: 'Праймер битумный универсальный',
  primerFast: 'Праймер битумный быстросохнущий',
  primerMastifix: 'Праймер полимерный Mastifix',
  masticWaterproof: 'Мастика битумная гидроизоляционная',
  masticMbr: 'Мастика битумная МБР',
  masticMbgG: 'Мастика битумная МБГ-Г',
  masticUniversal: 'Мастика битумная универсальная',
  masticRoof: 'Мастика битумная кровельная',
  pvcMembrane: 'ПВХ-мембрана',
  geotextile: 'Геотекстиль Marja-Tex',
  penopleks: 'Пеноплэкс',
  basaltWool: 'Базальтовая вата',
  sealant: 'Битумно-полимерный герметик MARJA БП-Г',
  vaporBarrier: 'Пароизоляция',
}

const UNIT_LABELS: Record<Unit, string> = {
  kg: 'кг',
  roll: 'рул.',
  m2: 'м²',
  m3: 'м³',
}

const OBJECT_LABELS: Record<CalcInput['objectType'], string> = {
  flatRoof: 'Плоская кровля',
  foundation: 'Фундамент / подвал',
}

const BASE_LABELS: Record<CalcInput['base'], string> = {
  concrete: 'Бетон',
  screed: 'Цементная стяжка',
  profiledSheet: 'Профнастил',
  oldRoofing: 'Старое рулонное покрытие',
}

const METHOD_LABELS: Record<string, string> = {
  torch: 'Наплавляемая рулонная',
  pvc: 'ПВХ-мембрана (механическое крепление)',
  coating: 'Обмазочная (мастика)',
  roll: 'Рулонная (наплавляемая)',
  combined: 'Комбинированная (мастика + рулон)',
}

const TIMING_LABELS: Record<TimingKey, string> = {
  now: 'Сейчас',
  month: 'В течение месяца',
  quarter: 'Через 1–3 месяца',
}

const INSULATION_LABELS: Record<CalcInput['insulation'], string> = {
  none: 'Без утеплителя',
  penopleks: 'Пеноплэкс',
  basalt: 'Базальтовая вата',
}

const clean = (value: string | undefined, max: number): string => (value ?? '').trim().slice(0, max)

export async function submitCalculatorRequest(
  input: CalculatorRequestInput,
): Promise<CalculatorResult> {
  const name = clean(input?.contact?.name, 200)
  const phone = clean(input?.contact?.phone, 50)

  if (!name || !phone) return { ok: false }
  // Honeypot — молча подтверждаем, чтобы бот не подбирал обход.
  if (clean(input?.contact?.website, 100)) return { ok: true }

  // Пересчитываем на сервере: в уведомление попадают суммы, которым можно доверять.
  const result = calculate(input.calc)
  if (result.lines.length === 0) return { ok: false }

  // Порог и дубли отвечают ok, но ничего не шлют: спамер не должен нащупать границу,
  // а живой человек с двойным кликом — увидеть ошибку на нормальной заявке.
  // Дубль проверяем первым, чтобы двойной клик не расходовал попытку из лимита.
  if (isDuplicate(`calculator:${phone}:${result.area}:${result.total}`)) return { ok: true }

  const ip = await getClientIp()
  if (!allowRequest('calculator', ip)) return { ok: false, reason: 'rateLimited' }

  const isRoof = input.calc.objectType === 'flatRoof'
  const method = isRoof ? input.calc.roofMethod : input.calc.foundationMethod

  const city = clean(input?.contact?.city, 100)
  const comment = clean(input?.contact?.comment, 1000)
  const locale = clean(input?.locale, 10)
  // Ключ приходит от клиента — в БД пускаем только известные значения.
  const timing = input?.contact?.timing
  const safeTiming = timing && timing in TIMING_LABELS ? timing : undefined

  const materials = result.lines
    .map(
      ({ key, qty, unit, total }) =>
        `• ${MATERIAL_LABELS[key]} — ${qty} ${UNIT_LABELS[unit]} (~${formatPrice(total)} UZS)`,
    )
    .join('\n')

  const submissionData = [
    { field: 'Имя', value: name },
    { field: 'Телефон', value: phone },
    { field: 'Город', value: city },
    { field: 'Срок закупки', value: safeTiming ? TIMING_LABELS[safeTiming] : '' },
    { field: 'Тип объекта', value: OBJECT_LABELS[input.calc.objectType] },
    { field: 'Площадь', value: `${result.area} м²` },
    { field: 'Основание', value: isRoof ? BASE_LABELS[input.calc.base] : '' },
    { field: 'Способ гидроизоляции', value: METHOD_LABELS[method] ?? '' },
    { field: 'Слоёв', value: String(input.calc.layers) },
    {
      // Высота захода нужна менеджеру: от неё зависит раскрой и расход усиления.
      field: 'Примыкания / парапеты',
      value:
        isRoof && input.calc.parapets > 0
          ? `${input.calc.parapets} п.м., заход ${clampParapetHeight(input.calc.parapetHeight)} см`
          : '',
    },
    {
      field: 'Геотекстиль',
      value: !isRoof && input.calc.geotextile ? 'Да' : '',
    },
    {
      field: 'Утеплитель',
      value:
        input.calc.insulation === 'none'
          ? ''
          : `${INSULATION_LABELS[input.calc.insulation]}, ${input.calc.insulationThickness} мм`,
    },
    { field: 'Материалы', value: `\n${materials}` },
    { field: 'Итого ориентировочно', value: `${formatPrice(result.total)} UZS` },
    { field: 'Язык сайта', value: locale },
    { field: 'Комментарий', value: comment },
  ]

  const submission = { submissionData, form: { title: 'Расчёт объекта (калькулятор)' } }

  // Сначала БД, потом отправка: упавший Telegram или CRM больше не означает
  // бесследно потерянную заявку. Запись не блокирует отправку, см. recordLead.
  const leadId = await recordLead({
    source: 'calculator',
    name,
    phone,
    city,
    timing: safeTiming,
    comment,
    area: result.area,
    amount: result.total,
    locale,
    ip,
    details: submissionData,
  })

  await deliverLead(leadId, {
    telegram: () => sendTelegramNotification(submission),
    crm: () => sendToCRM(submission),
  })

  return { ok: true }
}
