'use client'

import React, { useMemo, useState } from 'react'
import { Check, Loader2, Calculator as CalculatorIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatPrice } from '@/utilities/formatPrice'
import {
  submitCalculatorRequest,
  type CalculatorContact,
  type TimingKey,
} from '@/actions/submitCalculatorRequest'
import { trackLead } from '@/utilities/trackLead'

import {
  calculate,
  DEFAULT_INPUT,
  PARAPET_HEIGHT,
  PRODUCTS,
  productsForRole,
  type CalcInput,
  type PriceMap,
  type ProductKey,
  type ProductRole,
} from './calc'

type Props = {
  showPrices: boolean
  disclaimer?: string | null
  locale?: string
  /** Цены из каталога, посчитанные на сервере. */
  prices: PriceMap
}

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'rateLimited'

const TIMINGS: TimingKey[] = ['now', 'month', 'quarter']

/** Переключатель-сегмент: используется для типа объекта, режима ввода, слоёв. */
function Segmented<T extends string | number>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/** Целое или дробное число без знака: то, что имеет смысл для размеров объекта. */
const NUMERIC_DRAFT = /^\d*\.?\d*$/

/**
 * Числовое поле с текстовым вводом.
 *
 * Не `type="number"` сознательно: у него колесо мыши меняет значение при
 * скролле страницы (калькулятор стоит в середине длинной главной, и площадь
 * тихо уезжала бы на десятки метров), а «e» и «-» считаются валидным вводом.
 *
 * Пока поле правят, показываем черновую строку, а не число из состояния:
 * иначе стёртое поле мгновенно превращается в «0», и чтобы набрать 500,
 * приходится сначала удалять этот ноль. Границы применяем на blur — во время
 * набора зажимать нельзя, иначе не получится ввести «10», начав с «1».
 */
function NumberField({
  id,
  label,
  value,
  onChange,
  min = 0,
  max,
  suffix,
  hint,
}: {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  suffix?: string
  hint?: string
}) {
  const [draft, setDraft] = useState<string | null>(null)

  const shown = draft ?? (Number.isFinite(value) ? String(value) : '')

  const handleChange = (raw: string) => {
    // Запятую печатают чаще точки на русской раскладке — принимаем обе.
    const normalized = raw.replace(',', '.')
    if (!NUMERIC_DRAFT.test(normalized)) return

    setDraft(normalized)
    // «», «.» — незаконченный ввод: для расчёта это ноль, но поле не трогаем.
    const parsed = Number(normalized)
    onChange(normalized === '' || !Number.isFinite(parsed) ? 0 : parsed)
  }

  const handleBlur = () => {
    const clamped = Math.min(Math.max(value, min), max ?? Number.POSITIVE_INFINITY)
    if (clamped !== value) onChange(clamped)
    // Черновик отпускаем — дальше поле снова отражает состояние.
    setDraft(null)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={shown}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={suffix ? 'pr-14' : undefined}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

export const CalculatorForm: React.FC<Props> = ({ showPrices, disclaimer, locale, prices }) => {
  const t = useTranslations('calculator')
  const [input, setInput] = useState<CalcInput>(DEFAULT_INPUT)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [contact, setContact] = useState<CalculatorContact>({
    name: '',
    phone: '',
    city: '',
    comment: '',
    timing: 'now',
    website: '',
  })

  const result = useMemo(() => calculate(input, prices), [input, prices])
  const isRoof = input.objectType === 'flatRoof'

  // По профнастилу праймер не расходуется — селект для него скрываем.
  const needsPrimer =
    (isRoof ? input.roofMethod === 'torch' : true) && input.base !== 'profiledSheet'
  // У ПВХ-мембраны выбирать нечего: она идёт одна, механическим креплением.
  const showMaterials = !(isRoof && input.roofMethod === 'pvc')

  const set = <K extends keyof CalcInput>(key: K, value: CalcInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }))

  // Обычная функция, а не вложенный компонент: у вложенного при каждом рендере
  // менялся бы тип, и Select пересоздавался бы, теряя фокус.
  const renderProductField = (
    field:
      | 'topProduct'
      | 'bottomProduct'
      | 'foundationRollProduct'
      | 'primerProduct'
      | 'masticProduct',
    role: ProductRole,
    label: string,
  ) => (
    <div className="flex flex-col gap-1.5" key={field}>
      <Label htmlFor={`calc-${field}`}>{label}</Label>
      <Select value={input[field]} onValueChange={(value) => set(field, value as ProductKey)}>
        <SelectTrigger id={`calc-${field}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {productsForRole(role).map((key) => {
            const finish = PRODUCTS[key].finish
            return (
              <SelectItem key={key} value={key}>
                {t(`materials.${key}`)}
                {finish ? ` · ${t(`finishes.${finish}`)}` : ''}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setStatus('idle')
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contact.name.trim() || !contact.phone.trim() || status === 'submitting') return

    setStatus('submitting')
    const res = await submitCalculatorRequest({
      // timing уходит ключом ('now' | 'month' | 'quarter') — на сервере он станет
      // русской подписью, чтобы уведомление менеджеру было целиком на одном языке.
      contact,
      calc: input,
      locale,
    })
    if (res.ok) {
      setStatus('success')
      trackLead('calculator', { object_type: input.objectType, area: result.area })
    } else {
      // Заявка не ушла — конверсию не засчитываем, иначе аналитика покажет лид,
      // которого менеджер не увидит.
      setStatus(res.reason === 'rateLimited' ? 'rateLimited' : 'error')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Форма */}
      <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('fields.objectType')}
            </span>
            <Segmented
              value={input.objectType}
              onChange={(value) => set('objectType', value)}
              options={[
                { value: 'flatRoof' as const, label: t('objectTypes.flatRoof') },
                { value: 'foundation' as const, label: t('objectTypes.foundation') },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('fields.inputMode')}
            </span>
            <Segmented
              value={input.areaMode}
              onChange={(value) => set('areaMode', value)}
              options={[
                { value: 'area' as const, label: t('modes.area') },
                {
                  value: 'dimensions' as const,
                  label: isRoof ? t('modes.dimensions') : t('modes.perimeter'),
                },
              ]}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {input.areaMode === 'area' ? (
              <NumberField
                id="calc-area"
                label={t('fields.area')}
                value={input.area}
                onChange={(value) => set('area', value)}
                suffix={t('units.m2')}
              />
            ) : isRoof ? (
              <>
                <NumberField
                  id="calc-length"
                  label={t('fields.length')}
                  value={input.length}
                  onChange={(value) => set('length', value)}
                  suffix={t('units.m')}
                />
                <NumberField
                  id="calc-width"
                  label={t('fields.width')}
                  value={input.width}
                  onChange={(value) => set('width', value)}
                  suffix={t('units.m')}
                />
              </>
            ) : (
              <>
                <NumberField
                  id="calc-perimeter"
                  label={t('fields.perimeter')}
                  value={input.perimeter}
                  onChange={(value) => set('perimeter', value)}
                  suffix={t('units.lm')}
                />
                <NumberField
                  id="calc-depth"
                  label={t('fields.depth')}
                  value={input.depth}
                  onChange={(value) => set('depth', value)}
                  suffix={t('units.m')}
                />
              </>
            )}

            {isRoof && (
              <NumberField
                id="calc-parapets"
                label={t('fields.parapets')}
                value={input.parapets}
                onChange={(value) => set('parapets', value)}
                suffix={t('units.lm')}
              />
            )}

            {/* Высота нужна только когда примыкания есть: от неё зависит ширина
                полосы усиления, а значит и раскрой рулона. */}
            {isRoof && input.roofMethod !== 'pvc' && input.parapets > 0 && (
              <NumberField
                id="calc-parapet-height"
                label={t('fields.parapetHeight')}
                value={input.parapetHeight}
                onChange={(value) => set('parapetHeight', value)}
                min={PARAPET_HEIGHT.min}
                max={PARAPET_HEIGHT.max}
                suffix={t('units.cm')}
                hint={t('hints.parapetHeight')}
              />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="calc-method">{t('fields.method')}</Label>
              <Select
                value={isRoof ? input.roofMethod : input.foundationMethod}
                onValueChange={(value) =>
                  isRoof
                    ? set('roofMethod', value as CalcInput['roofMethod'])
                    : set('foundationMethod', value as CalcInput['foundationMethod'])
                }
              >
                <SelectTrigger id="calc-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(isRoof
                    ? (['torch', 'pvc'] as const)
                    : (['coating', 'roll', 'combined'] as const)
                  ).map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`methods.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="calc-base">{t('fields.base')}</Label>
              <Select
                value={input.base}
                onValueChange={(value) => set('base', value as CalcInput['base'])}
              >
                <SelectTrigger id="calc-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['concrete', 'screed', 'profiledSheet', 'oldRoofing'] as const).map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`bases.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('fields.layers')}
            </span>
            <Segmented
              value={input.layers}
              onChange={(value) => set('layers', value)}
              options={[
                { value: 1 as const, label: t('layers.one') },
                { value: 2 as const, label: t('layers.two') },
              ]}
            />
          </div>

          {showMaterials && (
            <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-900/40">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {t('fields.materials')}
              </span>

              <div className="grid gap-4 sm:grid-cols-2">
                {isRoof && input.roofMethod === 'torch' && (
                  <>
                    {renderProductField('topProduct', 'rollTop', t('fields.topLayer'))}
                    {input.layers === 2 &&
                      renderProductField('bottomProduct', 'rollBottom', t('fields.bottomLayer'))}
                  </>
                )}

                {!isRoof && input.foundationMethod !== 'coating' && (
                  <>
                    {renderProductField(
                      'foundationRollProduct',
                      'rollFoundation',
                      t('fields.foundationRoll'),
                    )}
                  </>
                )}
                {!isRoof && input.foundationMethod !== 'roll' && (
                  <>{renderProductField('masticProduct', 'mastic', t('fields.masticProduct'))}</>
                )}

                {needsPrimer &&
                  renderProductField('primerProduct', 'primer', t('fields.primerProduct'))}
              </div>

              {isRoof && input.roofMethod === 'torch' && (
                <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  {t('hints.layerRoles')}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="calc-insulation">{t('fields.insulation')}</Label>
              <Select
                value={input.insulation}
                onValueChange={(value) => set('insulation', value as CalcInput['insulation'])}
              >
                <SelectTrigger id="calc-insulation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['none', 'penopleks', 'basalt'] as const).map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`insulations.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {input.insulation !== 'none' && (
              <NumberField
                id="calc-thickness"
                label={t('fields.thickness')}
                value={input.insulationThickness}
                onChange={(value) => set('insulationThickness', value)}
                suffix={t('units.mm')}
              />
            )}
          </div>

          {!isRoof && (
            <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
              <Checkbox
                checked={input.geotextile}
                onCheckedChange={(checked) => set('geotextile', checked === true)}
              />
              {t('fields.geotextile')}
            </label>
          )}
        </div>
      </div>

      {/* Результат */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/60">
          <div className="mb-4 flex items-center gap-2">
            <CalculatorIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('result.title')}</h3>
          </div>

          {result.lines.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('result.empty')}</p>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                {t('result.area', { area: formatPrice(result.area) })}
              </p>

              <ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
                {result.lines.map((item) => (
                  <li key={item.key} className="flex items-start justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <a
                        href={`/${locale ?? 'uz'}/products/${PRODUCTS[item.key].slug}`}
                        className="text-sm font-medium text-gray-900 hover:text-primary dark:text-white"
                      >
                        {t(`materials.${item.key}`)}
                      </a>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {item.qty} {t(`units.${item.unit}`)}
                        {item.coverage
                          ? ` · ${formatPrice(item.qty * item.coverage)} ${t('units.m2')}`
                          : ''}
                      </p>
                    </div>
                    {showPrices && (
                      <span className="shrink-0 text-sm font-semibold text-gray-900 dark:text-white">
                        {item.total == null ? t('result.priceOnRequest') : formatPrice(item.total)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {showPrices && (
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {/* Часть позиций без цены — итог неполный, и подписать его
                          просто «Итого» было бы враньём. */}
                      {result.pricesComplete ? t('result.total') : t('result.totalPartial')}
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(result.total)} UZS
                    </span>
                  </div>
                  {!result.pricesComplete && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {t('result.missingPrices')}
                    </p>
                  )}
                </div>
              )}

              <Button className="mt-5 w-full cursor-pointer" size="lg" onClick={() => setOpen(true)}>
                {t('lead.button')}
              </Button>

              <p className="mt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {/* С выключенными ценами оговорка про цены только путает: в расчёте
                    их нет, и обещать «цены могут отличаться» не о чем. */}
                {disclaimer || t(showPrices ? 'result.disclaimer' : 'result.disclaimerVolumes')}
              </p>
            </>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('lead.title')}</DialogTitle>
            <DialogDescription>{t('lead.description')}</DialogDescription>
          </DialogHeader>

          {status === 'success' ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check className="h-6 w-6" />
              </div>
              <p className="font-medium">{t('lead.success')}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="calc-name">{t('lead.name')}</Label>
                <Input
                  id="calc-name"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  placeholder={t('lead.namePlaceholder')}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="calc-phone">{t('lead.phone')}</Label>
                <Input
                  id="calc-phone"
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder={t('lead.phonePlaceholder')}
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="calc-city">{t('lead.city')}</Label>
                <Input
                  id="calc-city"
                  value={contact.city}
                  onChange={(e) => setContact({ ...contact, city: e.target.value })}
                  placeholder={t('lead.cityPlaceholder')}
                  autoComplete="address-level2"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="calc-timing">{t('lead.timing')}</Label>
                <Select
                  value={contact.timing}
                  onValueChange={(value) => setContact({ ...contact, timing: value as TimingKey })}
                >
                  <SelectTrigger id="calc-timing">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMINGS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`timings.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Honeypot — скрыт от людей, заполняется ботами */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={contact.website}
                onChange={(e) => setContact({ ...contact, website: e.target.value })}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {status === 'error' && <p className="text-sm text-destructive">{t('lead.error')}</p>}
              {status === 'rateLimited' && (
                <p className="text-sm text-amber-600 dark:text-amber-500">
                  {t('lead.rateLimited')}
                </p>
              )}

              <Button type="submit" size="lg" className="gap-2" disabled={status === 'submitting'}>
                {status === 'submitting' && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === 'submitting' ? t('lead.submitting') : t('lead.submit')}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
